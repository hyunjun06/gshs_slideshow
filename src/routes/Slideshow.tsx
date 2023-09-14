import { useEffect, useState } from "react";
import { database } from "../firebase";

function Slideshow() {
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    
    const getImages = async () => {
    };
    
    useEffect(() => {
        getImages();
    }, []);
    
    return (
        <div>
            {imageURLs.map((url, index) => {
                return (
                    <img key={index} src={url} alt="" width="100" />
                );
            })}         
        </div>
    );
}

export default Slideshow;