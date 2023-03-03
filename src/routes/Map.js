import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGeolocation from "react-hook-geolocation";
import foodTrip from "../images/foodTrip.png"
import { Link, useHistory  } from 'react-router-dom';

import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Map.module.css";
const { kakao } = window;
function Map() {
    const [indCntry, SetIndCntry] = useState(0);
    const [curCity, setCurCity] = useState("");
    const [res, setRes] = useState([]);
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

    const Items = [["전체보기", "스시", "텐동", "라멘", "소바"],
    ["전체보기", "마라탕", "꿔바로우", "훠궈", "동파육"],
    ["전체보기", "햄버거", "피자", "스테이크", "미국 가정식"],
    ["전체보기", "커리", "탄두리 치킨", "라씨", "사모사"],
    ["전체보기", "쌀국수", "분짜", "반쎄오", "반미"],
    ["전체보기", "딤섬", "우육면", "완탕면", "에그타르트"],
    ["전체보기", "파스타", "이태리 피자", "리조또", "젤라토"],
    ["전체보기", "라따뚜이", "파스타", "잠봉뵈르", "코스 요리"],
    ["전체보기", "푸팟뽕커리", "팟타이", "쌀국수", "똠얌꿍"],
    ["전체보기", "타코", "부리또", "퀘사디아", "파히타"],
    ];
    const [cnt, SetCnt] = useState(0);
    const [indexes, setIndexes] = useState([false, false, false, false, false]);

    const onClick = (data) => {
        console.log(data.target.id);
        if (data.target.id === "0") {
            if (indexes[data.target.id]) {
                for (var i = 0; i < 5; i++) {
                    indexes[i] = false;
                }
                SetCnt(5);
            }
            else {
                for (var i = 0; i < 5; i++) {
                    indexes[i] = true;
                    if (indexes[i]) {
                        console.log(Items[indCntry][i]);
                    }
                }
                SetCnt(0);
            }

        }
        else {
            if (indexes[0]) {
                indexes[0] = false;
                SetCnt((prev) => prev - 1);
            }
            if (indexes[data.target.id]) {
                indexes[data.target.id] = false;
                SetCnt((prev) => prev - 1);
            } else {
                indexes[data.target.id] = true;
                SetCnt((prev) => prev + 1);
            }
            for (var i = 0; i < 5; i++) {
                if (indexes[i]) {
                    console.log(Items[indCntry][i]);
                }
            }


        }
        console.log(cnt);
    }
    var map;
    const container = document.getElementById('map');
    const { country } = useParams();
    const Makemenu = () => {
        if (country === "일본") {
            SetIndCntry(0);
        }
        else if (country === "중국") {
            SetIndCntry(1);

        }
        else if (country === "미국") {
            SetIndCntry(2);
        }
        else if (country === "인도") {
            SetIndCntry(3);
        }
        else if (country === "베트남") {
            SetIndCntry(4);
        }
        else if (country === "홍콩") {
            SetIndCntry(5);
        }
        else if (country === "이탈리아") {
            SetIndCntry(6);
        }
        else if (country === "프랑스") {
            SetIndCntry(7);
        }
        else if (country === "태국") {
            SetIndCntry(8);
        }
        else if (country === "멕시코") {
            SetIndCntry(9);
        }
    }

    const ps = new kakao.maps.services.Places();
    console.log(typeof (ps));
    let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    useEffect(() => {
        setRes([]);
        getMap();
        let curPos = { x: geol.longitude, y: geol.latitude, place_name: "현위치" };
        displayMarker(curPos);

        Makemenu()
        console.log("here");
        console.log(indCntry);
        for (var i = 1; i < 5; i++) {
            if (indexes[i]) {
                ps.keywordSearch(`${curCity} ${Items[indCntry][i]}`, placesSearchCB);
                console.log(`${curCity} ${Items[indCntry][i]}`);
            }
        }
        if (res !== undefined) {
            console.log("HQEQEQEQEQ");
        }
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                PushData(data)
                for (let i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                }
            }
            console.log(res);
        }
        function PushData(data) {
            setRes((res) => [...res, ...data]);
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


    }, [curCity, cnt])


    useEffect(() => ResList(res), [res]);

    const getMap = async () => {
        const options = {
            center: new kakao.maps.LatLng(geol.latitude, geol.longitude),
            level: 3
        };
        map = new kakao.maps.Map(container, options);

    }  
    const history = useHistory();   
    function onLIClick(event)
    {
        console.log(event.target.id); 
        window.open(`https://map.kakao.com/link/search/${event.target.innerText}`);
    }

    function ListItem(key, value) {
        var curul = document.getElementById('result');

        var newli = document.createElement('li');
        newli.key = key;
        newli.id = key;
        newli.innerText = value;
        newli.addEventListener("click",onLIClick);
        curul.appendChild(newli);
        console.log(newli);
        console.log(curul);
        return <li key={key} onClick={onLIClick}> {value} </li>;
    }

    function ResList(res) {
        console.log(res);
        const results = res;
        var curul = document.getElementById('result');
        while (curul.hasChildNodes()) {
            curul.removeChild(curul.firstChild);
        }
        if (results !== undefined) {
            const listItems = results.map((place) =>
                ListItem(place.id, place.place_name)
            );
            console.log("HERTQErQERQRR");
            console.log(listItems);


        }
    }



    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <Link to={`/misiktrip`}><img className={styles.homeName} src={foodTrip} /></Link>
            </div>
            <div className={styles.map} id='map' style={{ width: '390px', height: '350px' }}></div>
            <div className={styles.bottomSheet}>
                {Items[indCntry].map((item, key) => (
                    <div onClick={onClick} id={key} className={styles.listitem}>
                        {item}
                    </div>
                ))}
            </div>
            <div className={styles.resultSheet}>
                <ul id='result'></ul>
            </div>


        </div>
    );
}

export default Map;