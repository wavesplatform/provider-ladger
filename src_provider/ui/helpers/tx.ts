//

export const getTxName = (type: any) => { // todo type
    switch (type) {
        case 4: return 'Transfer';
        case 16: return 'Invoke Script';
        default: return 'Unknown'; 
    }
};
