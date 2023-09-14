import { useEffect, useState } from "react";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { database } from "../firebase";
import { v4 } from "uuid";
import { styled } from "styled-components";
import { FileUploader } from "react-drag-drop-files";

const Container = styled.div`
    width: 100vw;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const UploadCheckContainer = styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const UploadButton = styled.button`
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

const UploadCheck = styled.p`
    font-size: 16px;
    margin-left: 20px;
    font-weight: 100;
    color: ${(props) => props.theme.text};
    margin-right: 50px;
    
    span {
        font-weight: 700;
        margin-right: 10px;
    }
`;

const ImagesScroll = styled.div`
    width: 100%;
    height: 200px;
    overflow-x: scroll;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: ${(props) => props.theme.text};
`;

const Image = styled.img`
    height: 100px;
`;

const ImageIndex = styled.p`
    font-size: 16px;
    width: 30px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.background};
    font-weight: 100;
`;

const ImageContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 30px;
`;

const ImageDeleteButton = styled.button`
    width: 30px;
    height: 100px;
    border: none;
    background-color: ${(props) => props.theme.red};
    color: ${(props) => props.theme.text};
    font-weight: 100;
    cursor: pointer;
    
    &:hover {
        background-color: ${(props) => props.theme.redHover};
    }
`;

const ImagesScrollTitle = styled.p`
    width: 100%;
    font-size: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
    font-weight: 100;
    color: ${(props) => props.theme.text};
`;

function Home() {
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [imagesList, setImagesList] = useState<string[]>([]);
    const imagesRef = ref(database, "images/");

    const uploadImage = async () => {
        if(imageUpload == null) return;
        const fileExtension = imageUpload.name.split(".").pop();
        const fileName = imageUpload.name.substring(0, imageUpload.name.length - fileExtension!.length - 1);
        const imageRef = ref(database, "images/" + fileName + v4() + "." + fileExtension);
        await uploadBytes(imageRef, imageUpload);
        alert("업로드 완료!");
        getImages();
    };
    
    const getImages = async () => {
        setImagesList([]);
        const response = await listAll(imagesRef);
        response.items.forEach(async (item) => {
            const url = await getDownloadURL(item);
            setImagesList((prev) => [...prev, url]);
        });
    };

    const deleteImage = async (url: string) => {
        const imageName = url.split("/").pop()?.replace("%2F", "/").split("?")[0];
        const imageRef = ref(database, imageName);
        await deleteObject(imageRef);
        alert("삭제 완료!");
        getImages();
    };
    
    useEffect(() => {
        getImages();
    }, []);

    return (
        <Container>
            <FileUploader
                handleChange={(file: File) => setImageUpload(file)}
            />
            <UploadCheckContainer>
                <UploadCheck><span>업로드 할 이미지 파일</span>{imageUpload == null ? "파일 없음" : imageUpload!.name}</UploadCheck>
                <UploadButton onClick={uploadImage}>업로드</UploadButton>
            </UploadCheckContainer>
            <ImagesScrollTitle>현재 공유된 이미지</ImagesScrollTitle>
            <ImagesScroll>
                {imagesList.map((url, index) => {
                    return (
                        <ImageContainer key={index}>
                            <ImageIndex>{index}</ImageIndex>
                            <Image src={url} alt="" height="100" />
                            <ImageDeleteButton onClick={() => deleteImage(url)}>
                                삭제
                            </ImageDeleteButton>
                        </ImageContainer>
                    );
                })}
            </ImagesScroll>
        </Container>
	);
}

export default Home;