import { useState, useEffect } from "react";

export function userBuyerProfileEnums() {
    const [enums, setEnums] = useState({});

    useEffect(() => {
        fetch("http://localhost:8080/enums/buyer-profile-enums")
            .then(res => res.json())
            .then(data => setEnums(data))
            .catch(err => console.error("Failed to fetch buyer profile enums", err));
    }, []);

    return enums;
}