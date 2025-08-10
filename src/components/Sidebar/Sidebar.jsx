import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css, createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/logo.png';

const themeVars = {
    light: {
        bg: 'var(--color-sidebar-background-light-default)',
        hover: 'var(--color-sidebar-background-light-hover)',
        activeBg: 'var(--color-sidebar-background-light-active)',
        text: 'var(--color-text-light-default)',
        textHover: 'var(--color-text-light-hover)',
        textActive: 'var(--color-text-light-active)',
        logo: 'var(--color-text-logo-light-default)',
        btnBg: 'var(--color-button-background-light-default)',
        btnBgActive: 'var(--color-button-background-light-active)',
    },
    dark: {
        bg: 'var(--color-sidebar-background-dark-default)',
        hover: 'var(--color-sidebar-background-dark-hover)',
        activeBg: 'var(--color-sidebar-background-dark-active)',
        text: 'var(--color-text-dark-default)',
        textHover: 'var(--color-text-dark-hover)',
        textActive: 'var(--color-text-dark-active)',
        logo: 'var(--color-text-logo-dark-default)',
        btnBg: 'var(--color-button-background-dark-default)',
        btnBgActive: 'var(--color-button-background-dark-active)',
    },
};

const routes = [
    { title: 'Home', icon: 'house', path: '/' },
    { title: 'Sales', icon: 'chart-line', path: '/sales' },
    { title: 'Costs', icon: 'chart-column', path: '/costs' },
    { title: 'Payments', icon: 'wallet', path: '/payments' },
    { title: 'Finances', icon: 'chart-pie', path: '/finances' },
    { title: 'Messages', icon: 'envelope', path: '/messages' },
];

const bottomRoutes = [
    { title: 'Settings', icon: 'sliders', path: '/settings' },
    { title: 'Support', icon: 'phone-volume', path: '/support' },
];

const Sidebar = ({ color = 'light' }) => {
    const [theme, setTheme] = useState(color);
    const [isOpened, setIsOpened] = useState(true);
    const [activePath, setActivePath] = useState('/');

    const asideRef = useRef(null);

    useEffect(() => setTheme(color), [color]);
    const t = useMemo(() => themeVars[theme], [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const goToRoute = (path) => {
        setActivePath(path);
    };

    const toggleSidebar = () => setIsOpened((v) => !v);
    const toggleTheme = () => setTheme((v) => (v === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        const onDown = (e) => {
            const aside = asideRef.current;
            if (!aside) return;
            if (!isOpened) return;
            if (aside.contains(e.target)) return;
            setIsOpened(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [isOpened]);

    return (
        <>
            <GlobalTheme $t={t} />
            <Aside ref={asideRef} $t={t} $opened={isOpened} role="navigation" aria-label="Sidebar">
                <Top $opened={isOpened}>
                    <Logo $t={t} $opened={isOpened}>
                        <img src={logo} alt="Logo" />
                        <span className="label">TensorFlow</span>
                    </Logo>

                    <IconBtn
                        type="button"
                        $t={t}
                        $opened={isOpened}
                        onClick={toggleSidebar}
                        aria-label={isOpened ? 'Свернуть' : 'Развернуть'}
                        aria-expanded={isOpened}
                    >
                        <FontAwesomeIcon icon={isOpened ? 'angle-left' : 'angle-right'} />
                    </IconBtn>
                </Top>

                <Nav>
                    {routes.map((r) => (
                        <NavItem
                            key={r.title}
                            type="button"
                            $t={t}
                            $opened={isOpened}
                            $active={activePath === r.path}
                            onClick={() => goToRoute(r.path)}
                        >
              <span className="icon">
                <FontAwesomeIcon icon={r.icon} />
              </span>
                            <span className="label">{r.title}</span>
                        </NavItem>
                    ))}
                </Nav>

                <Bottom>
                    {bottomRoutes.map((r) => (
                        <NavItem
                            key={r.title}
                            type="button"
                            $t={t}
                            $opened={isOpened}
                            $active={activePath === r.path}
                            onClick={() => goToRoute(r.path)}
                        >
              <span className="icon">
                <FontAwesomeIcon icon={r.icon} />
              </span>
                            <span className="label">{r.title}</span>
                        </NavItem>
                    ))}

                    <Controls>
                        <SmallBtn type="button" $t={t} $opened={isOpened} onClick={toggleTheme} title="Переключить тему">
              <span className="icon">
                <FontAwesomeIcon icon={theme === 'light' ? 'sun' : 'moon'} />
              </span>
                            <span className="label">{theme === 'light' ? 'Light' : 'Dark'}</span>
                        </SmallBtn>
                    </Controls>
                </Bottom>
            </Aside>
        </>
    );
};

Sidebar.propTypes = { color: PropTypes.string };
export default Sidebar;


const GlobalTheme = createGlobalStyle`
    body {
        background: ${({ $t }) => $t.bg};
        color: ${({ $t }) => $t.text};
        transition: background 200ms ease, color 200ms ease;
    }
`;


const Aside = styled.aside`
    width: ${({ $opened }) => ($opened ? '260px' : '72px')};
    background: ${({ $t }) => $t.bg};
    color: ${({ $t }) => $t.text};
    height: 100vh;
    position: sticky;
    top: 0;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 12px;
    box-sizing: border-box;
    transition: width 220ms ease;
    overflow: hidden;
`;

const Top = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: ${({ $opened }) => ($opened ? '0' : '32px')};
    min-height: 36px;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img { width: 28px; height: 28px; display: block; }

    .label {
        color: ${({ $t }) => $t.logo};
        font-weight: 700;
        white-space: nowrap;
        opacity: ${({ $opened }) => ($opened ? 1 : 0)};
        max-width: ${({ $opened }) => ($opened ? '200px' : '0px')};
        transform: translateX(${({ $opened }) => ($opened ? '0' : '-4px')});
        transition: opacity 160ms ease, transform 160ms ease, max-width 160ms ease;
        overflow: hidden;
        pointer-events: ${({ $opened }) => ($opened ? 'auto' : 'none')};
    }
`;

const IconBtn = styled.button`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    border: none;
    background: ${({ $t }) => $t.btnBg};
    color: inherit;
    width: ${({ $opened }) => ($opened ? '28px' : '28px')};
    height: ${({ $opened }) => ($opened ? '32px' : '28px')};
    border-radius: 999px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 150ms ease, transform 150ms ease;
    &:hover { background: ${({ $t }) => $t.btnBgActive}; }
    &:active { transform: translateY(-50%) scale(0.98); }
`;

const Nav = styled.nav`
    margin-top: 10px;
    display: grid;
    gap: 6px;
    overflow-y: auto;
    padding-right: 4px;
`;

const sharedItem = css`
    position: relative;
    display: grid;
    grid-template-columns: ${({ $opened }) => ($opened ? '24px 1fr' : '1fr')};
    justify-items: ${({ $opened }) => ($opened ? 'stretch' : 'center')};
    align-items: center;
    gap: ${({ $opened }) => ($opened ? '10px' : '0')};
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 6px;      
        right: 6px;
        border-radius: 12px;
        background: transparent;
        opacity: 0;
        transition: opacity 150ms ease, background 150ms ease;
        z-index: 0;
    }

    .icon {
        font-size: 18px;
        line-height: 1;
        display: grid;
        place-items: center;
        z-index: 1; 
    }

    .label {
        z-index: 1;
        white-space: nowrap;
        opacity: ${({ $opened }) => ($opened ? 1 : 0)};
        max-width: ${({ $opened }) => ($opened ? '500px' : '0px')};
        transform: translateX(${({ $opened }) => ($opened ? '0' : '-4px')});
        transition: opacity 160ms ease, transform 160ms ease, max-width 160ms ease;
        overflow: hidden;
        pointer-events: ${({ $opened }) => ($opened ? 'auto' : 'none')};
    }

    &:hover::before {
        background: ${({ $t }) => $t.hover};
        opacity: 1;
    }

    ${({ $active, $t }) =>
            $active &&
            css`
      &::before { background: ${$t.activeBg}; opacity: 1; }
      color: ${$t.textActive};
      font-weight: 600;
    `}
`;

const NavItem = styled.button`${sharedItem}`;

const Bottom = styled.div`
    display: grid;
    gap: 6px;
    margin-top: 8px;
`;

const Controls = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 4px;
`;

const SmallBtn = styled.button`
    ${sharedItem};
    height: 40px;
    .icon { justify-self: center; }
`;
