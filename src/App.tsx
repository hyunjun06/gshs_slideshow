import { Outlet } from "react-router-dom";
import { styled } from "styled-components";
import MenuButton from "./components/MenuButton";

const TopBar = styled.div`
    width: 100%;
    height: 60px;
    color: ${(props) => props.theme.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 900;
    padding: 0 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 900;

    span {
        font-weight: 300;
    }
`;

function App() {
  return (
    <Outlet />
  );
}

export default App;
