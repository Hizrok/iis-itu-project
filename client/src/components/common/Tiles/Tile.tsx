// @author Petr Teichgrab

import { Link } from "react-router-dom";

interface TileProps {
    title: string;
    icon?: string;
    url: string;
  }
  
const Tile: React.FC<TileProps> = ({ title, icon, url }) => (
    <Link to={url} className="tile">
        <h2>{title}</h2>
        {icon && <img src={icon} alt="Icon" />}
    </Link>
);

export default Tile;