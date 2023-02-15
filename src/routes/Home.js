import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGeolocation from "react-hook-geolocation";
import styles from "../styles/Home.module.css";
import foodTrip from "../images/foodTrip.png"
import japanHome from "../images/japanHome.jpg"
import americaHome from "../images/americaHome.jpg"
import indiaHome from "../images/indiaHome.jpg"
import vietnamHome from "../images/vietnamHome.jpg"
import airplane from "../images/airplane.png"
import japan from "../images/japan.png"
import china from "../images/china.png"
import america from "../images/america.png"
import india from "../images/india.png"
import vietnam from "../images/vietnam.png"
function Home() {
    const [country, setCountry] = useState("일본");
    const [city, setCity] = useState("Korea");
    const [loading, setLoading] = useState("True");
    const [image, setImage] = useState(japanHome);
    const [cimage,setCimage] = useState(japan);
    const onSelect = (event) => {
        setCountry(event.target.value);
    };

    useEffect(() => {
        if (country === "일본") {
            setImage(japanHome);
            setCimage(japan);
        }
        else if (country === "중국") {
            setImage(japanHome);
            setCimage(china);
        }
        else if (country === "미국") {
            setImage(americaHome);
            setCimage(america);
        }
        else if (country === "인도") {
            setImage(indiaHome);
            setCimage(india);

        }
        else if (country === "베트남") {
            setImage(vietnamHome);
            setCimage(vietnam);
        }

    }, [country])
    const geolocation = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 15000,
        timeout: 12000,
    });

    useEffect(() => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.latitude}&lon=${geolocation.longitude}&appid=${process.env.REACT_APP_KEY}&units=metric`;
        fetch(url).then(response => response.json()).then(data => {
            console.log(data);
            setCity(data.name);
            if (data.name !== "Korea") {
                setLoading(false);
            }
        });

        console.log(url);
    }
        , [geolocation.longitude, geolocation.latitude])

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <img className={styles.homeName} src={foodTrip} />
                <p className={styles.detailName}>한국에서 맛보는 세계여행,<br />{city}에서 어디로 떠나세요?</p>

            </div>
            <div className={styles.select}>
                <p className={styles.from}>{city}</p>
                <img className={styles.plane} src={airplane} />

                <select className={styles.selectItem} value={country} onChange={onSelect} name="country" >
                    <option value="일본" >일본</option>
                    <option value="중국">중국</option>
                    <option value="미국">미국</option>
                    <option value="인도">인도</option>
                    <option value="베트남">베트남</option>
                </select>
                <img className={styles.countryimage} src={cimage}/>
            </div>
            <div className={styles.bottomImage}
                style={{ backgroundImage: `url(${image})` }} >
                <h2 className={styles.bottomDetail}>내위치에서</h2>
                <h2 className={styles.bottomDetail}>{country}음식여행</h2>
                <button className={styles.button}><Link to={`/map/${country}`}>바로가기</Link></button>
            </div>
        </div >
    );
}

export default Home;