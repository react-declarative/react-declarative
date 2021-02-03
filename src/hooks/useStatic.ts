import { useState } from 'react';

export const useStatic = (data: any) => {
    const [captured] = useState(data);
    return captured;
};

export default useStatic;
