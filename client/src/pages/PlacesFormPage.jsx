import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
    const {id} = useParams(); //:action from App.jsx
    const [title, setTitle] = useState("")
    const [address, setAddress] = useState("")
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState("")
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [maxGuests, setMaxGuests] = useState(100)
    const [redirect, setRedirect] = useState(false)
    const [price, setPrice] = useState(0)

    useEffect(() => {
        if (!id) return
        else {
            axios.get("/user-places/"+id).then(response => {
                const {data} = response
                setTitle(data.title)
                setAddress(data.address)
                setAddedPhotos(data.photos)
                setDescription(data.description)
                setPerks(data.perks)
                setExtraInfo(data.extraInfo)
                setCheckIn(data.checkIn)
                setCheckOut(data.checkOut)
                setMaxGuests(data.maxGuests)
                setPrice(data.price)
            })
        }
    }, [id])

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <div>
                {inputHeader(header)}
                {inputDescription(description)}
            </div>
        )
    }


    async function savePlace(ev) {
        ev.preventDefault()
        const placeData = {
            title,address,addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests
        }
        if (id) {
            //update
            axios.put("/user-places", {
                id, ...placeData
            })
            setRedirect(true)
        } else {
            //new place
            axios.post("/user-places",
                placeData //NOTE Brackets
            )
            setRedirect(true)
        }
    }

    if (redirect) { //will make this check before jsx is returned
        return <Navigate to={"/account/places"} />
    }

    return (
        <>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput("Title", "title for your place.. should be short and catchy")}
                    <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment"/>
                {preInput("Address","address to your place")}
                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address"/>
                {/* upload button */}
                {preInput("Photos","more = better")}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                {preInput("Description","description of the place")}
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Description" />
                {preInput("Perks","select all the perks of your place")}
                <div className="grid mt-2 gap-2 grid-cols-1">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput("Extra Info","house rules, etc")}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} placeholder="Description" />
                {preInput("Check-in/out times, max guests","add check in and out times, remember to allow time for cleaning in between guests")}
                    <div className="grid grid-cols-2 md:grid-cols-4">
                        <div>
                            <h3 className="mt-2 mb-1">Check in time</h3>
                            <input 
                                type="text"
                                value={checkIn}
                                onChange={ev => setCheckIn(ev.target.value)}
                                placeholder="16"
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 mb-1">Check out time</h3>
                            <input 
                                type="text"
                                value={checkOut}
                                onChange={ev => setCheckOut(ev.target.value)}
                                placeholder="11"
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 mb-1">Max number of guests</h3>
                            <input 
                                type="number"
                                value={maxGuests}
                                onChange={ev => setMaxGuests(ev.target.value)}                                       
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 mb-1">Price per night</h3>
                            <input 
                                type="number"
                                value={price}
                                onChange={ev => setPrice(ev.target.value)}                                       
                            />
                        </div>
                    </div>                       
                <button className="primary my-4 py-3">Save</button>
            </form>
        </>
    )
}
