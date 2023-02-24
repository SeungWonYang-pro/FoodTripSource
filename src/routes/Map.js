import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGeolocation from "react-hook-geolocation";
import foodTrip from "../images/foodTrip.png"

import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Map.module.css";
const { kakao } = window;
function Map() {
    const [curCity, setCurCity] = useState("");
    const geol = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 12000,
    });
    const ge = navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
    function onGeoOk(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        //kakao REST API에 get 요청을 보낸다.
        //파라미터 x,y에 lon,lat을 넣어주고 API_KEY를 Authorization헤더에 넣어준다.
        axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`
            , { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_REST_API}` } }
        )
            .then(res => {
                console.log(res.data.documents[0].address.region_3depth_name);
                setCurCity(res.data.documents[0].address.region_3depth_name);
            }
            ).catch(e => console.log(e))
    }
    function onGeoError() {
        alert("위치권한을 확인해주세요");
    }
    var map;
    const container = document.getElementById('map');
    const { country } = useParams();
    const ps = new kakao.maps.services.Places();
    let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    useEffect(() => {
        getMap();
        let curPos = { x: geol.longitude, y: geol.latitude, place_name: "현위치" };
        displayMarker(curPos);
        ps.keywordSearch(`${curCity} 초밥`, placesSearchCB);
        ps.keywordSearch(`${curCity} 돈까스`, placesSearchCB);
        ps.keywordSearch(`${curCity} 우동`, placesSearchCB);
        ps.keywordSearch(`${curCity} 텐동`, placesSearchCB)
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                for (let i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                }
            }
        }

        function displayMarker(place) {
            let markers = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x),
            });

            kakao.maps.event.addListener(markers, 'click', function () {
                // 마커를 클릭하면 장소명이 인포윈도우에 표출
                console.log(place);
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, markers);
            });
        }
    }, [curCity])




    const getMap = async () => {
        const options = {
            center: new kakao.maps.LatLng(geol.latitude, geol.longitude),
            level: 3
        };
        map = new kakao.maps.Map(container, options);

    }


    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        SearchReastaurant({ data })
    };
    const SearchReastaurant = ({ data }) => {
        console.log(data.name)


        return;
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <img className={styles.homeName} src={foodTrip} />
            </div>
            <div className={styles.map} id='map' style={{ width: '390px', height: '350px' }}></div>
            <div >
                <ul className={styles.bottomSheet}>
                    <li>전체보기</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>

                </ul>
            </div>
        </div>
    );
}

export default Map;