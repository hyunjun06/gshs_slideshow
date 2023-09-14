import { useEffect, useState } from "react";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { database } from "../firebase";
import { v4 } from "uuid";

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
        <div>
            <input
                type="file"
                onChange={(event) => {
                    if (event.target.files) {
                        setImageUpload(event.target.files[0]);
                    }
                }}
            />
            <button onClick={uploadImage}>업로드</button>
            <p>업로드 된 이미지:</p>
            <div>
                {imagesList.map((url, index) => {
                    return (
                        <div key={index}>
                            <img src={url} alt="" width="100" />
                            <button onClick={() => deleteImage(url)}>X</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;