import { useState, useEffect } from "react";

export function useEnums() {
  const [propertyTypes, setPropertyTypes] = useState({});
  const [heatingTypes, setHeatingTypes] = useState({});
  const [listingStatuses, setListingStatuses] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/enums/property-types")
      .then(res => res.json())
      .then(data => {
        const turkishPropertyTypes = {
          APARTMENT: "Daire",
          RESIDENCE: "Rezidans",
          VILLA: "Villa",
          DETACHED_HOUSE: "Müstakil Ev",
          DUPLEX: "Dubleks",
          TRIPLEX: "Tripleks",
          PENTHOUSE: "Penthouse",
          STUDIO: "Stüdyo (1+0)",
          LAND: "Arsa",
          FIELD: "Tarla",
          VINEYARD: "Bağ / Bahçe",
          OFFICE: "Ofis / Büro",
          SHOP: "Dükkan / Mağaza",
          WAREHOUSE: "Depo / Antrepo",
          HOTEL: "Otel / Turistik Tesis",
          PLAZA: "Plaza / İş Merkezi",
          BUILDING: "Komple Bina",
          FARMHOUSE: "Çiftlik Evi"
        };
        // Backend'den gelen verileri Türkçe karşılıkları ile eşleştiriyoruz
        setPropertyTypes(turkishPropertyTypes);
      });

    fetch("http://localhost:8080/enums/heating-types")
      .then(res => res.json())
      .then(data => {
        const turkishHeatingTypes = {
          KOMBI: "Kombi",
          CENTRAL_NATURAL_GAS: "Merkezi (Doğalgaz)",
          CENTRAL_COAL: "Merkezi (Kömür)",
          CENTRAL_ELECTRIC: "Merkezi (Elektrik)",
          UNDERFLOOR: "Yerden Isıtma",
          FLOOR_HEATER: "Kat Kaloriferi",
          AIR_CONDITIONING: "Klima",
          STOVE_WOOD: "Soba (Odun)",
          STOVE_COAL: "Soba (Kömür)",
          GEOTHERMAL: "Jeotermal",
          NONE: "Yok / Isıtmasız"
        };
        setHeatingTypes(turkishHeatingTypes);
      });

    fetch("http://localhost:8080/enums/listing-statuses")
      .then(res => res.json())
      .then(data => {
        const turkishStatuses = {
          ACTIVE: "Aktif",
          INACTIVE: "Pasif",
          SOLD: "Satıldı"
        };
        setListingStatuses(turkishStatuses);
      });
  }, []);

  return { propertyTypes, heatingTypes, listingStatuses };
}

export default useEnums;