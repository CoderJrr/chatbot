//Kullanıcıdan gelen mesajın içeriğine bakar ve hangi componentin eklenmesi gerektiğine karar verir.
import React from 'react';
import RandevuAl from '../components/RandevuAl';
import SonucGoruntule from '../components/SonucGoruntule';
import HastaneBilgisiAl from '../components/HastaneBilgisiAl';
import NobetciEczane from '../components/NobetciEczane';
import { createComponentResponse } from './Messages';
import { removeRandevuFormMessage } from './ButtonFunctions';

export const COMPONENT_TYPES = { //gönderilen mesaja göre components
    RANDEVU_AL: 'randevu al',
    SONUC_GORUNTULE: 'sonuç görüntüle',
    HASTANE_BILGISI: 'hastane bilgisi al',
    NOBETCI_ECZANE: 'nöbetçi eczane'
};

export const createComponentByType = (type = {}) => {
    const id = Date.now();

    switch (type) {
        case COMPONENT_TYPES.RANDEVU_AL:
            return {
                component: createComponentResponse(
                    'RandevuAl',
                    {
                        id: id
                    },
                    id
                ),
                id
            };
        case COMPONENT_TYPES.SONUC_GORUNTULE:
            return {
                component: createComponentResponse('SonucGoruntule', id),
                id
            };
        case COMPONENT_TYPES.HASTANE_BILGISI:
            return {
                component: createComponentResponse('HastaneBilgisiAl', id),
                id
            };
        case COMPONENT_TYPES.NOBETCI_ECZANE:
            return {
                component: createComponentResponse('NobetciEczane', id),
                id
            };
        default:
            return null;
    }
};

export const getComponentTypeFromContent = (content) => {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes(COMPONENT_TYPES.RANDEVU_AL)) {
        return COMPONENT_TYPES.RANDEVU_AL;
    } else if (lowerContent.includes(COMPONENT_TYPES.SONUC_GORUNTULE)) {
        return COMPONENT_TYPES.SONUC_GORUNTULE;
    } else if (lowerContent.includes(COMPONENT_TYPES.HASTANE_BILGISI)) {
        return COMPONENT_TYPES.HASTANE_BILGISI;
    } else if (lowerContent.includes(COMPONENT_TYPES.NOBETCI_ECZANE)) {
        return COMPONENT_TYPES.NOBETCI_ECZANE;
    }

    return null;
};