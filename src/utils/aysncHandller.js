// asyncHandler.js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // `requestHandler` function ko wrap karte hain aur agar error aati hai
        // toh usse next middleware ko pass karte hain.
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

// asyncHandler function ko export karte hain taaki baaki files me use kiya ja sake
export { asyncHandler };
