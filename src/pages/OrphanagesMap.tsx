import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {FiPlus, FiArrowRight} from 'react-icons/fi'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet' //biblioteca de mapas
//TileLayer é para definir o 'servidor' de onde vão vir as imagens do mapa

import mapMarkerImg from '../images/map-marker.svg'

import '../styles/pages/orphanages-map.css'
import mapIcon from '../utils/mapIcon'
import api from '../services/api'

//apenas atributos que serão usados na página
interface Orphanage{
    id: number;
    latitude: number;
    longitude: number;
    name: string
}

function OrphanagesMap(){

    //indicando que o formatato será uma lista de orfanatos
    const [orphanages, setOrphanages] =  useState <Orphanage[]>([])

    //será execultado uma única vez, assim que iniciar
    useEffect(()=>{
        api.get('orphanages').then(response=>{
            setOrphanages(response.data) //listagem de orfanatos

        })
    }, [])

    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>

                    <h2>Esacolha um orfanato do mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Palmeira dos Índios</strong>
                    <span>Alagoas</span>
                </footer>
            </aside>

            <Map
                center={[-9.4186832,-36.6322913]}
                zoom={15}
                style={{width: '100%', height: '100%'}}
            >
                {/*<TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>*/}
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                {orphanages.map(orphanage=>{
                    return(
                        <Marker
                            key={orphanage.id}//identificando o Marker, caso precise
                            position={[orphanage.latitude,orphanage.longitude]} 
                            icon={mapIcon}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight
                                        size={20}
                                        color="#FFF"
                                    />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF"/>
            </Link>
        </div>
    )
}

export default OrphanagesMap;