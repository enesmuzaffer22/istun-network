import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function ImageCropper({ isOpen, onClose, onCropComplete, aspectRatio, title }) {
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImg = () => {
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Çözünürlüğü %40 azalt (0.6 ile çarp)
    const cropWidth = completedCrop.width * scaleX * 0.6;
    const cropHeight = completedCrop.height * scaleY * 0.6;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext("2d");

    // Daha iyi kalite için imageSmoothingEnabled'ı ayarla
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX, // Kaynak alan orijinal boyutta
      completedCrop.height * scaleY, // Kaynak alan orijinal boyutta
      0,
      0,
      cropWidth, // Hedef alan %40 küçültülmüş
      cropHeight // Hedef alan %40 küçültülmüş
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.85 // %85 kalite - dosya boyutu optimize edildi
      );
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg();
      onCropComplete(croppedImageBlob);
      handleClose();
    }
  };

  const handleClose = () => {
    setImageSrc("");
    setCrop();
    setCompletedCrop();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {!imageSrc && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Resim Seçin
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {imageSrc && (
          <div className="mb-4">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={100}
              minHeight={aspectRatio === 1 ? 100 : 100 / aspectRatio}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-96"
              />
            </ReactCrop>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg"
          >
            İptal
          </button>
          {imageSrc && completedCrop && (
            <button
              onClick={handleCropComplete}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Kırpma Tamamla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
