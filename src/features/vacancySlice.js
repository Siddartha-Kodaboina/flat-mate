
import { createSlice } from '@reduxjs/toolkit';

export const vacancySlice = createSlice({
    name: 'vacancy',
    initialState: {
        vacancy: {
            from: '',
            to: '',
            requirements: ''
        },
        community: {
            housingType: '',
            title: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            amenities: '',
            averageRent: '',
            communityDescription: '',
            websiteURL: '',
            photos: '',
            place_id: '',
            state_code: '',
            country: '',
            country_code: '',
        },
        room: {
            totalBedRooms: '',
            bathRooms: '',
            maleCount: '',
            femaleCount: '',
            sharingType: '',
            monthlyRent: '',
            utilitiesCost: '',
            amenities: '',
            do: '',
            dont: '',
            roomDescription: '',
            photos: '',
        }
    },
    reducers: {
        updateVacancy: (state, action) => {
        state.vacancy = { ...state.vacancy, ...action.payload };
        },
        updateHousingType: (state, action) => {
            state.housingType = { ...state.housingType, ...action.payload };
        },
        updateCommunity: (state, action) => {
            state.community = { ...state.community, ...action.payload };
        },
        updateRoom: (state, action) => {
            state.room = { ...state.room, ...action.payload };
        },
    },
});

export const { updateVacancy, updateHousingType, updateCommunity, updateRoom} = vacancySlice.actions;

export default vacancySlice.reducer;
