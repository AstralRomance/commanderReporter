import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { IManagerService, ManagerService } from 'services';
import { ApiRequest } from 'utils/ApiRequest';

export const useLeaders = ({ eventId }) => {
    const request = useRef<ApiRequest<IManagerService.IGetEvents.Response>>();
    
    
    return { eventId }
}