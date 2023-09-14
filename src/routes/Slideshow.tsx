import { useEffect, useState } from "react";
import { database } from "../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { styled } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

interface IContainer {
    isfullscreen: boolean;
}

const Container = styled.div<IContainer>`
    width: 100vw;
    height: ${(props) => props.isfullscreen ? "100vh" : "calc(100vh - 110px)"};
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.text};
    top: 0;
    position: ${(props) => props.isfullscreen ? "absolute" : "relative"};
    z-index: ${(props) => props.isfullscreen ? "2" : "0"};
`;

const InfoContainer = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
`;

const Info = styled.p`
    font-size: 16px;
    font-weight: 100;
    color: ${(props) => props.theme.text};
`;

const FullscreenButton = styled.button`
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 5px;
    background-color: ${(props) => props.theme.gray};
    color: ${(props) => props.theme.text};
    font-weight: 100;
    cursor: pointer;
    
    &:hover {
        background-color: ${(props) => props.theme.grayHover};
    }
`;

const FullscreenNotif = styled(motion.h1)`
    font-size: 12px;
    font-weight: 100;
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.background};
    padding: 20px;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

function Slideshow() {
    const [imagesList, setImagesList] = useState<string[]>([]);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showNotif, setShowNotif] = useState<boolean>(false);
    const imagesRef = ref(database, "images/");

    const getImages = async () => {
        setImagesList([]);
        const response = await listAll(imagesRef);
        response.items.forEach(async (item) => {
            const url = await getDownloadURL(item);
            setImagesList((prev) => [...prev, url]);
        });
    };

    useEffect(() => {
        getImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prev) => {
                if(prev + 1 >= imagesList.length) return 0;
                return prev + 1;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [imagesList]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "ArrowLeft") {
                setImageIndex((prev) => {
                    if(prev - 1 < 0) return imagesList.length - 1;
                    return prev - 1;
                });
            } else if(e.key === "ArrowRight") {
                setImageIndex((prev) => {
                    if(prev + 1 >= imagesList.length) return 0;
                    return prev + 1;
                });
            } else if(e.key === "Escape") setIsFullscreen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFullscreen, imagesList]); 

    useEffect(() => {
        if(isFullscreen) {
            setShowNotif(true);
            setTimeout(() => setShowNotif(false), 3000);
        }
    }, [isFullscreen]);
    
    return (
		<>
			<Container isfullscreen={isFullscreen}>
                <AnimatePresence>
                    {showNotif && <FullscreenNotif
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >ESC키를 눌러 전체화면 나가기</FullscreenNotif>}
                </AnimatePresence>
				<img src={imagesList[imageIndex]} alt="" width="100%" />
			</Container>
            <InfoContainer>
                <Info>Slide: {imageIndex + 1}/{imagesList.length}</Info>
                <FullscreenButton onClick={() => setIsFullscreen(true)}>전체화면</FullscreenButton>
            </InfoContainer>
		</>
	);
}

export default Slideshow;