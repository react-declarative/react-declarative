import { createScaleRect } from '../scaleRect';

const scaleRect = createScaleRect({
    maxHeight: 100,
    maxWidth: 100,
});

describe ('Check scale rect fn', () => {

    it ('Will scale height as expected', () => {
        const size = scaleRect({
            height: 125,
            width: 100,
        });
        expect(size.height).toBe(100);
        expect(size.width).toBe(80);
    });

    
    it ('Will scale width as expected', () => {
        const size = scaleRect({
            height: 100,
            width: 125,
        });
        expect(size.height).toBe(80);
        expect(size.width).toBe(100);
    });

    it ('Will scale height and width as expected', () => {
        const size = scaleRect({
            height: 125,
            width: 125,
        });
        expect(size.height).toBe(100);
        expect(size.width).toBe(100);
    });

    it ('Will not scale height and width if no need to', () => {
        const size = scaleRect({
            height: 85,
            width: 95,
        });
        expect(size.height).toBe(85);
        expect(size.width).toBe(95);
    });

});
