// multer : pour gérer les requêtes HTTP avec envoie de fichier.

//importation de multer 
const multer = require("multer");

// le dictionnaire des MIME TYPES
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/png": "png"

};

//la destination du fichier (repertoire) et générer un nom de fichier unique.
const storage = multer.diskStorage({
    //la destination de stockage du fichier
    destination : (req, file, callback) => {
        callback(null, "../../front/res/photos");
    },
    filename : (req, file, callback) => {
        //supprimer les espaces dans le nom du fichier
        const name =  file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + "_" + Date.now() + extension);
    }
})




//exportation du middleware multer
module.exports = multer({storage}).single("image");