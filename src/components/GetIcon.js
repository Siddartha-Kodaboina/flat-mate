import React from 'react'
import PlaceIcon from '@mui/icons-material/Place';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import KitchenIcon from '@mui/icons-material/Kitchen';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
import BalconyIcon from '@mui/icons-material/Balcony';
import CabinIcon from '@mui/icons-material/Cabin';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import GridViewIcon from '@mui/icons-material/GridView';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import SecurityIcon from '@mui/icons-material/Security';
import PetsIcon from '@mui/icons-material/Pets';
import ChairIcon from '@mui/icons-material/Chair';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import PoolIcon from '@mui/icons-material/Pool';
import BathtubIcon from '@mui/icons-material/Bathtub';
import DryIcon from '@mui/icons-material/Dry';
import BathroomIcon from '@mui/icons-material/Bathroom';
import HotTubIcon from '@mui/icons-material/HotTub';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import AdjustIcon from '@mui/icons-material/Adjust';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import ElevatorIcon from '@mui/icons-material/Elevator';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import PasswordIcon from '@mui/icons-material/Password';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import CelebrationIcon from '@mui/icons-material/Celebration';
const iconsMap = {
    'Gym': FitnessCenterIcon,
    'Refrigirator': KitchenIcon,
    'Power Backup': SettingsBackupRestoreIcon,
    'CCTV': AdjustIcon,
    'Reception': MarkunreadMailboxIcon,
    'Elevator': ElevatorIcon,
    'Swimming Pool': PoolIcon,
    'Fitness Center': FitnessCenterIcon,
    'Clubhouse': NightlifeIcon,
    'Tennis Courts': SportsTennisIcon,
    'Playground': GolfCourseIcon,
    'BBQ/Picnic Area': OutdoorGrillIcon,
    'Dog Park': PetsIcon,
    'Gated Access': PasswordIcon,
    'Walking Trails': DirectionsWalkIcon,
    'On-Site Maintenance': EngineeringIcon,
    'Common Areas with Wi-Fi': NetworkWifiIcon,
    'Business Center': BusinessIcon,
    'Package Receiving': LocalShippingIcon,
    '24-Hour Emergency Maintenance': ContactEmergencyIcon,
    'Pet-Friendly Policies': PetsIcon,
    'Recycling Centers': RecyclingIcon,
    'Car Wash Stations': LocalCarWashIcon,
    'Resident Events': CelebrationIcon,
    'Controlled Access Entry': PasswordIcon,
    'Guest Parking': LocalParkingIcon,
    'Carpeting': CarpenterIcon,
    'Window Coverings': GridViewIcon,
    'Extra Storage Space': SpaceDashboardIcon,
    'Fireplace': FireplaceIcon,
    'Vaulted Ceilings': SecurityIcon,
    'Pet-Friendly Room': PetsIcon,
    'Furnished Options': ChairIcon,
    'Energy-Efficient Appliances': OfflineBoltIcon,
    'Almirah': CheckroomIcon,
    'Swimming Pool': PoolIcon,
    'Bathtub': BathtubIcon,
    'Dryer': DryIcon,
    'Bathroom': BathroomIcon,
    'Washing': LocalLaundryServiceIcon,
    'placeicon': PlaceIcon,
    'Air Conditioning': AcUnitIcon,
    'High-Speed Internet Access': NetworkCheckIcon,
    'Cable/Satellite TV Ready': OndemandVideoIcon,
    'Washer and Dryer In-Unit': LocalLaundryServiceIcon,
    'Dishwasher': RiceBowlIcon,
    'Microwave': MicrowaveIcon,
    'Refrigerator': KitchenIcon,
    'Oven/Range': KitchenIcon,
    'Walk-In Closets': CheckroomIcon,
    'Ceiling Fans': ModeFanOffIcon,
    'Balcony/Patio': BalconyIcon,
    'Hardwood Floors': CabinIcon,
    'Parking': LocalParkingIcon,
    'Jakuzzi': HotTubIcon
};


const GetIcon = ({ name }) => { 
    let Icon = iconsMap[name] || PlaceIcon;

    if (!Icon) {
        console.error('Icon not found for name:', name); 
        Icon = PlaceIcon;
    } 

    return <Icon />;
};


export default GetIcon