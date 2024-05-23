const generateAddress = (address_components) => {
    const AddressDetails = {
        'address': '',
        'postal_code': '',
        'city': '',
        'state': '',
        'state_code': '',
        'country': '',
        'country_code': ''
    }
    address_components.forEach(component => {
          
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number": {
            AddressDetails.address += " " + component.long_name;
            break;
          }

          case "route": {
            AddressDetails.address += " " + component.short_name;
            break;
          }

          case "postal_code": {
            AddressDetails.postal_code = component.long_name;
            break;
          }

          case "locality":{
            AddressDetails.city =  component.long_name;
            break;
          }
          case "administrative_area_level_1": {
            AddressDetails.state =  component.long_name;
            AddressDetails.state_code =  component.short_name;
            break;
          }
          case "country":{
            AddressDetails.country =  component.long_name;
            AddressDetails.country_code =  component.short_name;
            break;
          }
        }
    });

    return AddressDetails;
}

export default generateAddress;