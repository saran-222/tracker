import express from "express";
import AuthHelper from "../../helper/authHelper.js";
import { ErrorHelper } from "../../helper/errorHelper.js";


const routesv1 = express.Router({ caseSensitive: true });


routesv1.post('/role', ErrorHelper.asyncError(RoleController.saveRole));


routesv1.post('/mobileregister', ErrorHelper.asyncError(OtpController.register));


routesv1.post('/advertisement', Advertisement.fields([
    { name: 'web', maxCount: 1 },
    { name: 'mobile', maxCount: 1 }
]), AdvertisementController.save);




routesv1.use(AuthHelper.authorizationToken);


if (process.env.NODE_ENV === 'demo') routesv1.use(AuthHelper.checkTrial);


routesv1.post('/uploadidproof', AuthHelper.checkPermission(["DOCTOR"]), IdProof.single("proof"), ErrorHelper.asyncError(UserController.uploadIdProof));


export { routesv1, createDir }