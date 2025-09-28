import PropTypes from "prop-types";
import styles from './nav-link.module.css';

const AppNavLink = ({ to, icon, text, active }) => {
    return (
        <a
            href={to}
            className={`${styles.link} text text_type_main-default ${active ? 'text_color_primary' : 'text_color_inactive'}`}
        >
            {icon}
            <span>{text}</span>
        </a>
    );
};

AppNavLink.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    active: PropTypes.bool,
};

export { AppNavLink };
