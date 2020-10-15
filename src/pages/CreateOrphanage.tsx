import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet' //evento ao clicar no mapa

import {  FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import SideBar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {

  const history = useHistory()

  const [position, setPosition] = useState({latitude: 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState <File[]>([])
  const [previewImages, setPreviewImages] = useState <string[]>([])

  function handleMapClick(event:LeafletMouseEvent){
    const {lat, lng} = event.latlng
    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  function handleSelectImages(event:ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }
    const selectedImages = Array.from(event.target.files) //Transformando arquivos pegados em array
    setImages(selectedImages) 

    const selectedImagesPreview = selectedImages.map(image=>{
      return URL.createObjectURL(image) //pegando "caminho" do arquivo
    })

    setPreviewImages(selectedImagesPreview)
  }

  async function handleSubmit(event: FormEvent){ //importado de react
    event.preventDefault() //não permite recarregar a página

    const {latitude, longitude} = position

    const data = new FormData()

    data.append('name',name)
    data.append('latitude',String(latitude))
    data.append('longitude',String(longitude))
    data.append('about',about)
    data.append('instructions',instructions)
    data.append('opening_hours',opening_hours)
    data.append('open_on_weekends',String(open_on_weekends))
  
    images.forEach(image=>{
      data.append('images',image)
    })

    await api.post('orphanages', data)

    alert('Cadastro realizado com sucesso!')

    history.push('/app') //mudar de tela
  }

  return (
    <div id="page-create-orphanage">
      <SideBar/> 

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-9.4186832,-36.6322913]} 
              style={{ width: '100%', height: 280 }}
              zoom={13}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude!==0 && ( //se for verdadeiro, retorna, senão retorna null
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude,position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name"
                value={name}
                onChange={event=> setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name" 
                maxLength={300}
                value={about}
                onChange={event=> setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image=>{
                  return <img key={image} src={image} alt={name}/>
                })}

                <label htmlFor="images[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

                {/* Não irá aprecer. A função do  input será passada para o label acima */}
              <input multiple onChange={handleSelectImages} type="file" id="images[]"/>
              {/* Multiple: pode escolher mais de um arquivo de uma vez */}
              
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                maxLength={300}
                value={instructions}
                onChange={event=> setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
              id="opening_hours"
              maxLength={300}
              value={opening_hours}
              onChange={event=> setOpeningHours(event.target.value)}
            />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends?"active":""}
                  onClick={()=>setOpenOnWeekends(true)}
                >
                  Sim
                </button>

                <button
                  type="button"
                  className={!open_on_weekends?"active":""}
                  onClick={()=>setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
