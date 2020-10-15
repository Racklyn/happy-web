import Leaflet from "leaflet";  //para definir item customizado

import mapMarkerImg from '../images/map-marker.svg'

const mapIcon  = Leaflet.icon({
    iconSize: [58, 68],
    iconAnchor: [29, 68], //para que a ponta do ícone esteja no ponto
    popupAnchor: [170,2], //posição do popup

    iconUrl: mapMarkerImg,
})

export default mapIcon