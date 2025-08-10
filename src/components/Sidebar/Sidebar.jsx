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
    const edgeBtnRef = useRef(null);

    useEffect(() => setTheme(color), [color]);


    const t = useMemo(() => themeVars[theme], [theme]);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const goToRoute = (path) => {
        setActivePath(path);
        setIsOpened(false); // закрыть панель при переходе
        console.log(`going to "${path}"`);
    };

    const toggleSidebar = () => setIsOpened(v => !v);
    const toggleTheme = () => setTheme(v => (v === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        const onDown = (e) => {
            if (!isOpened) return;
            const aside = asideRef.current;
            const edgeBtn = edgeBtnRef.current;
            if (!aside) return;
            if (aside.contains(e.target)) return;
            if (edgeBtn && edgeBtn.contains(e.target)) return;

            setIsOpened(false);
        };

        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [isOpened]);

    return (
        <>
            <GlobalTheme $t={t} />

            {!isOpened && (
                <EdgeButton ref={edgeBtnRef} type="button" $t={t} onClick={toggleSidebar} aria-label="Открыть меню">
                    <FontAwesomeIcon icon="bars" />
                </EdgeButton>
            )}

            <Aside ref={asideRef} $t={t} $opened={isOpened}>
                <Top>
                    <Logo $t={t} $opened={isOpened}>
                        <img src={logo} alt="Logo" />
                        <span className="label">TensorFlow</span>
                    </Logo>

                    <IconBtn type="button" $t={t} onClick={toggleSidebar} title={isOpened ? 'Свернуть' : 'Развернуть'}>
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
                            <FontAwesomeIcon icon="sun" />
                            <span className="label">{theme === 'light' ? 'Light' : 'Dark'}</span>
                        </SmallBtn>
                    </Controls>
                </Bottom>
            </Aside>
        </>
    );
};

Sidebar.propTypes = {
    color: PropTypes.string,
};

export default Sidebar;


const GlobalTheme = createGlobalStyle`
    body {
        background: ${({ $t }) => $t.bg};
        color: ${({ $t }) => $t.text};
        transition: background 200ms ease, color 200ms ease;
    }
`;

const Aside = styled.aside`
  width: ${({ $opened }) => ($opened ? '260px' : '0px')};
  background: ${({ $t }) => $t.bg};
  color: ${({ $t }) => $t.text};
  height: 100vh;
  position: sticky;
  top: 0;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: ${({ $opened }) => ($opened ? '12px' : '0')};
  box-sizing: border-box;
  transition: width 220ms ease, padding 220ms ease;
    
  pointer-events: ${({ $opened }) => ($opened ? 'auto' : 'none')};
  overflow: hidden;
`;

const Top = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img {
        width: 28px;
        height: 28px;
        display: block;
    }

    .label {
        color: ${({ $t }) => $t.logo};
        font-weight: 700;
        white-space: nowrap;
        opacity: ${({ $opened }) => ($opened ? 1 : 0)};
        transform: translateX(${({ $opened }) => ($opened ? '0' : '-4px')});
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: ${({ $opened }) => ($opened ? 'auto' : 'none')};
    }
`;

const IconBtn = styled.button`
    border: none;
    background: ${({ $t }) => $t.btnBg};
    color: inherit;
    width: 36px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 150ms ease, transform 150ms ease;

    &:hover {
        background: ${({ $t }) => $t.btnBgActive};
    }
    &:active {
        transform: scale(0.98);
    }
`;

const Nav = styled.nav`
  margin-top: 10px;
  display: grid;
  gap: 6px;
  overflow-y: auto;
  padding-right: 4px;
`;

const sharedItem = css`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;

  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;

  .icon {
    font-size: 18px;
    line-height: 1;
    display: grid;
    place-items: center;
  }

  .label {
    white-space: nowrap;
    opacity: ${({ $opened }) => ($opened ? 1 : 0)};
    transform: translateX(${({ $opened }) => ($opened ? '0' : '-4px')});
    transition: opacity 160ms ease, transform 160ms ease;
    pointer-events: ${({ $opened }) => ($opened ? 'auto' : 'none')};
  }

  transition: background 150ms ease, color 150ms ease, transform 150ms ease;

  &:hover {
    background: ${({ $t }) => $t.hover};
    color: ${({ $t }) => $t.textHover};
  }

  ${({ $active, $t }) =>
    $active &&
    css`
      background: ${$t.activeBg};
      color: ${$t.textActive};
      font-weight: 600;
    `}
`;

const NavItem = styled.button`
    ${sharedItem}
`;

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
  grid-template-columns: 20px 1fr;
  padding: 8px 10px;
  background: ${({ $t }) => $t.btnBg};

  &:hover {
    background: ${({ $t }) => $t.btnBgActive};
  }
`;

const EdgeButton = styled.button`
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: ${({ $t }) => $t.btnBg};
  color: ${({ $t }) => $t.text};
  transition: background 150ms ease, transform 150ms ease;

  &:hover { background: ${({ $t }) => $t.btnBgActive}; }
  &:active { transform: scale(0.98); }
`;
