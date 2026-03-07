import { useState, useEffect } from "react";

export function useEnums() {
  const [propertyTypes, setPropertyTypes] = useState({});
  const [heatingTypes, setHeatingTypes] = useState({});
  const [listingStatuses, setListingStatuses] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/enums/property-types")
      .then(res => res.json())
      .then(data => setPropertyTypes(data));

    fetch("http://localhost:8080/enums/heating-types")
      .then(res => res.json())
      .then(data => setHeatingTypes(data));

    fetch("http://localhost:8080/enums/listing-statuses")
      .then(res => res.json())
      .then(data => setListingStatuses(data));
  }, []);

  return { propertyTypes, heatingTypes, listingStatuses };
}

export default useEnums;