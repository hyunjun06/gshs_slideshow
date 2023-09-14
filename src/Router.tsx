import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Slideshow from "./routes/Slideshow";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/slideshow",
                element: <Slideshow />
            }
        ],
    }
], {basename: "/gshs_slideshow"});

export default router;