import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGeolocation from "react-hook-geolocation";
import { useParams } from "react-router-dom";
const { kakao } = window;
function Map() {
    var map;
    const [markers, setMarkers] = useState([])
    const { country } = useParams();

    const geolocation = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 12000,
    });
    const getCountry = () => {

        console.log(country);

    }
    const getMap = async () => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(geolocation.latitude, geolocation.longitude),
            level: 3
        };
        map = new kakao.maps.Map(container, options);
        var markerPosition = new kakao.maps.LatLng(geolocation.latitude, geolocation.longitude);

        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
    }
    useEffect(() => {
        getMap();
    }, [geolocation.latitude, geolocation.longitude]);

    useEffect(() => {
        getCountry();
    })
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        SearchReastaurant({ data })
    };
    const SearchReastaurant = ({ data }) => {
        console.log(data.name)


        return;
    }

    return (
        <div>
            <div style={{ center: true }}>{country} 여행</div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>원하는 것</label>
                    <input {...register("name")} />
                    <input type="submit" />
                </form>
            </div>
            <div id='map' style={{ width: '1000px', height: '800px' }}></div>
            
        </div>
    );
}

export default Map;