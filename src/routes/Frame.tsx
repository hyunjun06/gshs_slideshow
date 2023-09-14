import { Link, Outlet } from "react-router-dom";
import { styled } from "styled-components";
import MenuButton from "../components/MenuButton";
import { useState } from "react";

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
    
    &:hover {
        cursor: pointer;
        color: ${(props) => props.theme.textHover};
    }
`; 

interface IMenuContainer {
    isOpen: boolean;
}

const MenuContainer = styled.div<IMenuContainer>`
    width: 400px;
    height: 100vh;
    background-color: ${(props) => props.theme.text};
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    transition: 0.3s;
    transform: ${(props) => props.isOpen ? "translateX(0)" : "translateX(100%)"};   
    padding-top: 140px;
`;

const MenuText = styled.p`
    width: 100%;
    font-size: 20px;
    font-weight: 100;
    color: ${(props) => props.theme.background};
    text-align: center;
    margin-bottom: 80px;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        cursor: pointer;
        scale: 1.1;
    }
`;

function Frame() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
		<>
			<TopBar>
				<Title>
					<Link to="/">GSHS <span>경기과학고등학교</span></Link>
				</Title>
				<div
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					style={{ zIndex: 2 }}>
					<MenuButton
						color={isMenuOpen ? "#111" : "#fff"}
						isOpen={isMenuOpen}
					/>
				</div>
			</TopBar>
			<Outlet />
			<MenuContainer isOpen={isMenuOpen}>
                <MenuText onClick={() => setIsMenuOpen(false)}><Link to="/">파일 올리기</Link></MenuText>
                <MenuText onClick={() => setIsMenuOpen(false)}><Link to="/slideshow">슬라이드 쇼</Link></MenuText>
			</MenuContainer>
		</>
	);
}

export default Frame;