var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { InvoiceModalPage } from '../../../pages/modals/invoice-modal/invoice-modal';
import { AttachmentModalPage } from '../../../pages/modals/attachment-modal/attachment-modal';
import { FileUploader } from 'ng2-file-upload';
import { Constant } from '../../../providers/constant/constant';
import { TooltipPage } from '../../modals/tooltip/tooltip';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import moment from 'moment';
var CreateClaimPage = /** @class */ (function () {
    function CreateClaimPage(navCtrl, navParams, modalCtrl, common, constant, alertCtrl, transfer, camera, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.common = common;
        this.constant = constant;
        this.alertCtrl = alertCtrl;
        this.transfer = transfer;
        this.camera = camera;
        this.popoverCtrl = popoverCtrl;
        // @ViewChild('input') myInput ;
        this.claimObject = {};
        this.errorFields = {};
        this.claimStatusList = [];
        this.dropDownData = [];
        this.invoiceDetails = {};
        this.isSubmitted = false;
        this.minDate = new Date().toISOString();
        this.claimId = '';
        this.claimStatus = '';
        this.currencyObject = {
            'Type': '',
            'CurrencySymbol': '',
            'Threshold': '',
            'ContactFormat': '',
            'RegexString': []
        };
        this.isViewMode = true;
        this.isEditMode = false;
        this.stepNavigation = '0';
        this.stepsCompleted = 0;
        this.cameraUploaderPalletTicket = [];
        this.cameraUploaderCartonTicket = [];
        this.cameraUploaderDefectiveTicket = [];
        this.uploaderPalletTicket = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
        this.uploadermasterCartonBarcode = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
        this.uploaderdefectiveSampleAttach = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
        this.palletTicketFileUploadDetail = [];
        this.masterCartonBarcodeFileUploadDetail = [];
        this.uploaderDefectiveDetail = [];
        this.palletStorageAfterChange = [];
        this.cartonStorageAfterChange = [];
        this.uploaderDefectiveAfterChange = [];
        this.URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
        this.claimKeyVal = '';
        /*Validate each sections*/
        this.emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
        this.common.hideLoader();
        this.initilizeClaimObject();
        this.claimObject.ComplaintNumber = this.navParams.get('complaintNumber');
        this.isViewMode = this.navParams.get('isViewMode');
        this.claimObject.ClaimDetails.ClaimTypeId = this.navParams.get('claimTypeId') ? this.navParams.get('claimTypeId') : '4';
        this.getAllDropdownData();
        this.fileUploadInitilize();
    }
    CreateClaimPage.prototype.ngAfterViewInit = function () {
    };
    //    ionViewLoaded() {
    //    setTimeout(() => {
    //      this.myInput.setFocus();
    //    },150);
    // }
    /*Angular wrapper for Cordova to upload the file captured from camera*/
    /*uploadFromCamera(_imageURI?: String, _serverURL?:String): Observable<any> {
      return Cordova.deviceready.mergeMap(() => ZoneObservable.create(this.zone, (observer: any) => {
          var _fileOptions = new FileUploadOptions();
          _fileOptions.fileKey = "file";
          _fileOptions.fileName = _imageURI.substr(_imageURI.lastIndexOf('/') + 1);
          _fileOptions.mimeType = "image/jpeg";
          _fileOptions.chunkedMode = false;
          var _fileTransfer = new FileTransfer();
          (<any>_fileTransfer).upload(_imageURI, _serverURL, (result: any) => {
                observer.next(result);
                observer.complete();
          }, observer.error, _fileOptions);
      }));
    }*/
    CreateClaimPage.prototype.uploadFromCamera = function (_imageURI, _serverURL, _successCallback, _errorCallBack) {
        var _fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'file',
            fileName: _imageURI.substr(_imageURI.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {}
        };
        _fileTransfer.upload(_imageURI, _serverURL, options).then(function (result) {
            console.log('result');
        }, function (err) {
            alert(err);
        });
    };
    /*Initilize the onInitPalletCamera*/
    CreateClaimPage.prototype.onInitPalletCamera = function (event) {
        var _this = this;
        var cameraOptions = {
            quality: 15,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            _this.cameraUploaderPalletTicket.push(imageData);
            var _attachObj = {
                name: imageData.split('/').pop(),
                source: 'camera',
                FilePath: imageData,
                FileName: imageData.split('/').pop()
            };
            _this.palletTicketFileUploadDetail.push(_attachObj);
        }, function (err) {
            console.log(err);
        });
    };
    /*Initilize the onInitCartonCamera*/
    CreateClaimPage.prototype.onInitCartonCamera = function (event) {
        var _this = this;
        var cameraOptions = {
            quality: 15,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            _this.cameraUploaderCartonTicket.push(imageData);
            var _attachObj = {
                name: imageData.split('/').pop(),
                source: 'camera',
                FilePath: imageData,
                FileName: imageData.split('/').pop()
            };
            _this.masterCartonBarcodeFileUploadDetail.push(_attachObj);
        }, function (err) {
            console.log(err);
        });
    };
    /*Initilize the onInitDefectiveCamera*/
    CreateClaimPage.prototype.onInitDefectiveCamera = function (event) {
        var _this = this;
        var cameraOptions = {
            quality: 15,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            _this.cameraUploaderDefectiveTicket.push(imageData);
            var _attachObj = {
                name: imageData.split('/').pop(),
                source: 'camera',
                FilePath: imageData,
                FileName: imageData.split('/').pop()
            };
            _this.uploaderDefectiveDetail.push(_attachObj);
        }, function (err) {
            console.log(err);
        });
    };
    CreateClaimPage.prototype.fileUploadInitilize = function () {
        var _this = this;
        this.uploaderPalletTicket = new FileUploader({ url: this.URL });
        this.uploaderPalletTicket.onAfterAddingFile = function (fileItem) {
            _this.fileslengthPallet = _this.uploaderPalletTicket.queue.length;
            _this.palletTicketFileUploadDetail.push(fileItem.file);
            fileItem.withCredentials = false;
        };
        this.uploaderPalletTicket.onCompleteItem = function (item, response, status, headers) {
            console.log(response);
        };
        this.uploadermasterCartonBarcode = new FileUploader({ url: this.URL });
        this.uploadermasterCartonBarcode.onAfterAddingFile = function (fileItem) {
            _this.fileslengthMaster = _this.uploadermasterCartonBarcode.queue.length;
            _this.masterCartonBarcodeFileUploadDetail.push(fileItem.file);
            fileItem.withCredentials = false;
        };
        this.uploadermasterCartonBarcode.onCompleteItem = function (item, response, status, headers) {
        };
        this.uploaderdefectiveSampleAttach = new FileUploader({ url: this.URL });
        this.uploaderdefectiveSampleAttach.onAfterAddingFile = function (fileItem) {
            _this.fileslengthDefectiveSampleReceived = _this.uploaderdefectiveSampleAttach.queue.length;
            _this.uploaderDefectiveDetail.push(fileItem.file);
            fileItem.withCredentials = false;
        };
        this.uploaderdefectiveSampleAttach.onCompleteItem = function (item, response, status, headers) {
        };
    };
    /*Show the attachment Modal for Pallet, Carton etc., */
    CreateClaimPage.prototype.showAttachmentdModal = function (_fileUploadDetails, _uploaderQueue, _cameraUploader, _claimObject, _key) {
        var attachmentModal = this.modalCtrl.create(AttachmentModalPage, {
            attachments: _fileUploadDetails.length ? _fileUploadDetails : [],
            queue: _uploaderQueue.length ? _uploaderQueue : [],
            camera: _cameraUploader.length ? _cameraUploader : [],
            claimObj: _claimObject.length ? _claimObject : [],
            key: _key,
            videMode: this.isViewMode
        });
        attachmentModal.present();
        attachmentModal.onDidDismiss(function (deletedImages) {
        });
    };
    //calluploadAllfile
    CreateClaimPage.prototype.uploadAllImages = function (_claimId, _action) {
        var _this = this;
        /*Upload images captured from the camera*/
        if (this.cameraUploaderPalletTicket.length <= 10) {
            for (var index = 0; index < this.cameraUploaderPalletTicket.length; index++) {
                var _file = this.cameraUploaderPalletTicket[index];
                var _serverUrl = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=palletKey';
                this.uploadFromCamera(_file, _serverUrl, function (res) {
                    console.log('File uploaded successfully.');
                }, function (err) {
                    console.log(err);
                    alert('Error while uploading the file, please try again.');
                });
            }
        }
        else {
            this.common.showToast('Can upload only 10 files');
        }
        /*Upload images captured from the camera*/
        for (var index = 0; index < this.cameraUploaderCartonTicket.length; index++) {
            var _file = this.cameraUploaderCartonTicket[index];
            var _serverUrl = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=mcbKey';
            this.uploadFromCamera(_file, _serverUrl, function (res) {
                console.log('File uploaded successfully.');
            }, function (err) {
                console.log(err);
                alert('Error while uploading the file, please try again.');
            });
        }
        /*Upload images captured from the camera*/
        for (var index = 0; index < this.cameraUploaderDefectiveTicket.length; index++) {
            var _file = this.cameraUploaderDefectiveTicket[index];
            var _serverUrl = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=claimKey';
            this.uploadFromCamera(_file, _serverUrl, function (res) {
                console.log('File uploaded successfully.');
            }, function (err) {
                console.log(err);
                alert('Error while uploading the file, please try again.');
            });
        }
        for (var index = 0; index < this.uploaderPalletTicket.queue.length; index++) {
            var element = this.uploaderPalletTicket.queue[index];
            if (element.url !== undefined) {
                element.url = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=palletKey';
            }
        }
        for (var index = 0; index < this.uploadermasterCartonBarcode.queue.length; index++) {
            var element = this.uploadermasterCartonBarcode.queue[index];
            if (element.url !== undefined) {
                element.url = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=mcbKey';
            }
        }
        for (var index = 0; index < this.uploaderdefectiveSampleAttach.queue.length; index++) {
            var element = this.uploaderdefectiveSampleAttach.queue[index];
            if (element.url !== undefined) {
                element.url = this.constant.baseURL + 'api/UpFile?claimId=' + _claimId + '&key=claimKey';
            }
        }
        if (this.uploaderPalletTicket.queue.length > 0) {
            this.uploaderPalletTicket.uploadAll();
        }
        if (this.uploadermasterCartonBarcode.queue.length > 0) {
            this.uploadermasterCartonBarcode.uploadAll();
        }
        if (this.uploaderdefectiveSampleAttach.queue.length > 0) {
            this.uploaderdefectiveSampleAttach.uploadAll();
        }
        setTimeout(function () {
            _this.common.hideLoader();
            _this.navCtrl.pop();
        }, 3000);
    };
    CreateClaimPage.prototype.ionViewDidLoad = function () {
        if (this.isViewMode)
            this.stepsCompleted = 5;
    };
    CreateClaimPage.prototype.getAllDropdownData = function () {
        var _this = this;
        this.common.showLoader();
        this.common.http.doGet(this.common.url.getAllDropDownDataURL(), function (response) {
            if (response.ResponseCode === 200 && response.Data) {
                _this.dropDownData = response.Data;
                _this.claimObject.ClaimDetails.SBU_ID = _this.dropDownData.SBUList[0].SBUId;
                _this.populateCountry(_this.claimObject.ClaimDetails.SBU_ID);
                if (_this.claimObject.ComplaintNumber) {
                    _this.getClaimDetails(_this.claimObject.ComplaintNumber);
                    return;
                }
                else {
                    /*Get the Initiator Name, Phone number and extension.*/
                    _this.common.http.doGet(_this.common.url.getWeightageListURL(), function (response) {
                        if (response.Data) {
                            _this.claimObject.InitiatorDetails.InitiatorName = response.Data.FullName;
                            _this.claimObject.InitiatorDetails.InitiatorPhone = response.Data.PhoneNumber;
                            _this.claimObject.InitiatorDetails.Extension = response.Data.Extn;
                        }
                        _this.common.hideLoader();
                    }, function (error) {
                        _this.common.hideLoader();
                    });
                }
            }
        }, function (error) {
            _this.common.hideLoader();
        });
    };
    CreateClaimPage.prototype.getClaimDetails = function (complaintNumber) {
        var _this = this;
        this.common.http.doGet(this.common.url.getClaimDetailsURL(complaintNumber), function (response) {
            if (response.ResponseCode === 200 && response.Data) {
                _this.claimObject = response.Data;
                _this.uploaderDefectiveDetail = [];
                if (_this.claimObject.ClaimAttachments && _this.claimObject.ClaimAttachments.length) {
                    for (var i = 0; i < _this.claimObject.ClaimAttachments.length; i++) {
                        _this.uploaderDefectiveDetail.push({ 'name': _this.claimObject.ClaimAttachments[i].FileName, 'path': _this.claimObject.ClaimAttachments[i].FilePath, 'AttachmentID': _this.claimObject.ClaimAttachments[i].AttachmentID });
                    }
                }
                _this.palletTicketFileUploadDetail = [];
                if (_this.claimObject.PalletTicketAttachments && _this.claimObject.PalletTicketAttachments.length) {
                    for (var i = 0; i < _this.claimObject.PalletTicketAttachments.length; i++) {
                        _this.palletTicketFileUploadDetail.push({ 'name': _this.claimObject.PalletTicketAttachments[i].FileName, 'path': _this.claimObject.PalletTicketAttachments[i].FilePath, 'AttachmentID': _this.claimObject.PalletTicketAttachments[i].AttachmentID });
                    }
                }
                _this.masterCartonBarcodeFileUploadDetail = [];
                if (_this.claimObject.MasterCartonBarcodeAttachments && _this.claimObject.MasterCartonBarcodeAttachments.length) {
                    for (var i = 0; i < _this.claimObject.MasterCartonBarcodeAttachments.length; i++) {
                        _this.masterCartonBarcodeFileUploadDetail.push({ 'name': _this.claimObject.MasterCartonBarcodeAttachments[i].FileName, 'path': _this.claimObject.MasterCartonBarcodeAttachments[i].FilePath, 'AttachmentID': _this.claimObject.MasterCartonBarcodeAttachments[i].AttachmentID });
                    }
                }
                _this.claimObject.ActionRequested.ExpectedDateToReceiveSamples = response.Data.ActionRequested.ExpDateRcvSamples;
                _this.claimObject.CreatedBy = JSON.parse(localStorage.getItem("Weightage")).UserId;
                _this.claimObject.ClaimDetails.SBU_ID = response.Data.ClaimDetails.SBU.SBUId;
                _this.claimObject.ActionRequested.Responsible = 1;
                _this.claimObject.CustomerDetails.DistributionChannelID = response.Data.CustomerDetails.DistributionChannel.ChannelID;
                _this.claimObject.CustomerDetails.ModeOfComplaintID = response.Data.CustomerDetails.ComplaintMode.ModeID;
                _this.populateCountry(_this.claimObject.ClaimDetails.SBU_ID);
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
        });
    };
    CreateClaimPage.prototype.invoiceSearchClick = function (_invoiceNumber) {
        var _this = this;
        this.invoiceDetails = {};
        if (!_invoiceNumber) {
            this.common.showToast('Please enter an Invoice No.');
            return;
        }
        if (_invoiceNumber && !this.isValidNumber(_invoiceNumber)) {
            this.common.showToast('Invoice No. should be a number value.');
            return;
        }
        this.common.showLoader();
        var inputData = {
            "CountryId": 1,
            "SearchKey": _invoiceNumber
        };
        this.common.http.doPost(this.common.url.getInvoiceSearch(), inputData, function (response) {
            _this.common.hideLoader();
            if (response.ResponseCode === 200 && response.Data) {
                _this.invoiceDetails = response.Data;
                var invoiceModal = _this.modalCtrl.create(InvoiceModalPage, { invoiceDetails: _this.invoiceDetails });
                invoiceModal.present();
                invoiceModal.onDidDismiss(function (selectedInvoice) {
                    if (_this.invoiceDetails.ES_HEADER && selectedInvoice) {
                        _this.claimObject.ClaimDetails.InvoiceCurrency = _this.invoiceDetails.ES_HEADER.CURRENCY;
                        _this.claimObject.ClaimDetails.InvoiceValue = _this.invoiceDetails.ES_HEADER.AMOUNT;
                        _this.claimObject.CustomerDetails.CustomerNumber = _this.invoiceDetails.ES_HEADER.CUSTOMER;
                        _this.claimObject.CustomerDetails.CustomerPhone = _this.invoiceDetails.ES_HEADER.TEL_NUMBER;
                        _this.claimObject.CustomerDetails.CustomerName = _this.invoiceDetails.ES_HEADER.NAME;
                    }
                    if (selectedInvoice) {
                        _this.claimObject.ProductDetails.DeliveryNumber = selectedInvoice.DELIVERY;
                        _this.claimObject.ProductDetails.SKUNumber = selectedInvoice.KDMAT;
                        _this.claimObject.ProductDetails.InternalSKU = selectedInvoice.MATNR;
                        selectedInvoice.LGMNG = (selectedInvoice.LGMNG) ? selectedInvoice.LGMNG.split('.')[0] : '';
                        _this.claimObject.ProductDetails.NoOfDeliveredItems = selectedInvoice.LGMNG;
                    }
                });
            }
            else if (response.ResponseCode === 400) {
                _this.common.showToast('SAP Login Failed.');
            }
            else if (response.ResponseCode === 600) {
                _this.common.showToast('Unknown error occured.');
            }
            else {
                _this.common.showToast(response.ResponseMessage);
            }
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast('Unknown error occured.');
        });
    };
    CreateClaimPage.prototype.validateAndSubmitClaim = function (_claim, _action) {
        if (!this.validateBasicDetails(_claim)) {
            this.gotoSlide(0);
            return false;
        }
        if (!this.validateCustomerDetails(_claim)) {
            this.gotoSlide(1);
            return false;
        }
        if (!this.validateProductDetails(_claim)) {
            this.gotoSlide(2);
            return false;
        }
        if (!this.validateClaimDetails(_claim)) {
            this.gotoSlide(3);
            return false;
        }
        if (_claim.ClaimDetails.sendEmailsTo && !this.isValidEmailIds(_claim.ClaimDetails.sendEmailsTo)) {
            this.common.showToast('Please enter valid email Ids.');
            return false;
        }
        this.draftOrSubmitClaim(_claim, _action);
    };
    CreateClaimPage.prototype.draftOrSubmitClaim = function (_claim, _action) {
        var _this = this;
        _claim.ClaimAction = _action;
        if (_claim.CustomerDetails.Country)
            delete _claim.CustomerDetails.Country;
        this.common.showLoader();
        this.common.http.doPost(this.common.url.getCreateNewClaimURL(), _claim, function (response) {
            if (response.ResponseCode === 200 && response.Data) {
                if (response.Data.Data) {
                    var val = response.Data.Data;
                    var c = val.split(';');
                    _claim.ComplaintNumber = c[1].replace('ComplaintNumber =', '').trim();
                    _this.claimId = c[2].replace('ClaimId = ', '').trim();
                    _this.claimStatus = c[3].replace('Status = ', '').trim();
                    _this.uploadAllImages(_this.claimId, _action);
                }
                _this.common.showToast(response.Data.ResponseMessage, 'success');
            }
            else {
                _this.common.showToast('Error in creating Claim');
                _this.common.hideLoader();
            }
        }, function (error) {
        });
    };
    CreateClaimPage.prototype.validateBasicDetails = function (_claim) {
        this.isSubmitted = true;
        if (_claim.InitiatorDetails.InitiatorPhone && !this.isValidNumber(_claim.InitiatorDetails.InitiatorPhone)) {
            this.errorFields.InitiatorPhone = true;
            this.common.showToast('Initiator Phone should be a number value.');
            return false;
        }
        if (_claim.InitiatorDetails.Extension && !this.isValidNumber(_claim.InitiatorDetails.Extension)) {
            this.common.showToast('Initiator Phone Extension should be a number value.');
            return false;
        }
        if (_claim.ClaimDetails.PONumber && !this.isValidNumbercomma(_claim.ClaimDetails.PONumber)) {
            this.common.showToast('PO Number should be a number value.');
            return false;
        }
        if (_claim.ClaimDetails.InvoiceNumber && !this.isValidNumbercomma(_claim.ClaimDetails.InvoiceNumber)) {
            this.common.showToast('Invoice No. should be a number value.');
            return false;
        }
        if (_claim.ClaimDetails.SBU_ID == '0') {
            this.common.showToast('Please select Sales Business Unit');
            return false;
        }
        if (_claim.ProductDetails.ComplaintCategoryID == '0') {
            this.common.showToast('Please select Complaint Category');
            return false;
        }
        if (_claim.CustomerDetails.ModeOfComplaintID == '0') {
            this.common.showToast('Please select Mode of Complaint');
            return false;
        }
        return true;
    };
    CreateClaimPage.prototype.validateCustomerDetails = function (_claim) {
        this.isSubmitted = true;
        if (!_claim.CustomerDetails.CustomerName) {
            this.common.showToast('Please enter customer name');
            return false;
        }
        if (!_claim.CustomerDetails.CustomerNumber) {
            this.common.showToast('Please enter customer number');
            return false;
        }
        if (_claim.CustomerDetails.CustomerNumber.length > 10) {
            this.common.showToast('Customer No. should be less than or equal to 10 characters.');
            return false;
        }
        if (_claim.CustomerDetails.CustomerPhone && !this.isValidNumber(_claim.CustomerDetails.CustomerPhone)) {
            this.common.showToast('Customer Phone should be a number value.');
            return false;
        }
        if (_claim.CustomerDetails.Extn && !this.isValidNumber(_claim.CustomerDetails.Extn)) {
            this.common.showToast('Customer Phone Extension should be a number value.');
            return false;
        }
        if (_claim.CustomerDetails.DistributionChannelID == '0') {
            this.common.showToast('Please select distribution channel');
            return false;
        }
        if (!_claim.CustomerDetails.ContactPerson) {
            this.common.showToast('Please enter contact person name');
            return false;
        }
        if (_claim.CustomerDetails.Email && !this.emailPattern.test(_claim.CustomerDetails.Email)) {
            this.common.showToast("Please enter customer's valid email");
            return false;
        }
        return true;
    };
    CreateClaimPage.prototype.validateProductDetails = function (_claim) {
        this.isSubmitted = true;
        if (_claim.ProductDetails.BrandID == '0') {
            this.common.showToast('Please select Brand');
            return false;
        }
        /*if(!_claim.ProductDetails.SKUNumber || (_claim.ProductDetails.SKUNumber && (_claim.ProductDetails.SKUNumber.length>10 || !this.isAlphaNumeric(_claim.ProductDetails.SKUNumber)))) {
          this.common.showToast('SKU No. should be a alphanumeric value with less than 10 characters.');
          return false;
        }*/
        if (!_claim.ProductDetails.InternalSKU || (_claim.ProductDetails.InternalSKU && (_claim.ProductDetails.InternalSKU.length > 10 || !this.isAlphaNumeric(_claim.ProductDetails.InternalSKU)))) {
            this.common.showToast('Internal SKU No. should be a alphanumeric value with less than 10 characters.');
            return false;
        }
        if (!_claim.ProductDetails.ProductDescription) {
            this.common.showToast('Please enter valid product description.');
            return false;
        }
        if (_claim.ProductDetails.DeliveryNumber && !this.isValidNumber(_claim.ProductDetails.DeliveryNumber)) {
            this.common.showToast('Delivery No. should be a number value.');
            return false;
        }
        if (!_claim.ProductDetails.NoOfDeliveredItems) {
            this.common.showToast('Please enter delivered items.');
            return false;
        }
        if (_claim.ProductDetails.NoOfDeliveredItems && !this.isValidNumber(_claim.ProductDetails.NoOfDeliveredItems)) {
            this.common.showToast('No.of delivered item should be a number value.');
            return false;
        }
        if (!_claim.ProductDetails.NoOfDefectedItems) {
            this.common.showToast('Please enter defective items.');
            return false;
        }
        if (_claim.ProductDetails.NoOfDefectedItems && !this.isValidNumber(_claim.ProductDetails.NoOfDefectedItems)) {
            this.common.showToast('No.of defective item should be a number value.');
            return false;
        }
        if (parseInt(_claim.ProductDetails.NoOfDefectedItems) > parseInt(_claim.ProductDetails.NoOfDeliveredItems)) {
            this.common.showToast('No. of defective items should be less than No. of delivered items.');
            return false;
        }
        if (moment(_claim.ClaimDetails.CreatedDate).diff(moment(_claim.ProductDetails.DeliveryDate), 'days') < 0) {
            this.common.showToast('Delivery date should be before the Create Date.');
            return false;
        }
        if (this.uploaderPalletTicket.queue.length + this.cameraUploaderPalletTicket.length > 10) {
            this.common.showToast('Maximum 10 files can be attached for Pallet Ticket.');
            return false;
        }
        return true;
    };
    CreateClaimPage.prototype.validateClaimDetails = function (_claim) {
        this.isSubmitted = true;
        if (!_claim.ActionRequested.ComplaintDesc) {
            this.common.showToast('Please enter complaint description.');
            return false;
        }
        if (moment(_claim.ClaimDetails.CreatedDate).diff(moment(_claim.ActionRequested.ExpectedDateToReceiveSamples), 'days') > 0) {
            this.common.showToast('Expected sample receive date should be after the Create Date.');
            return false;
        }
        if (this.uploaderdefectiveSampleAttach.queue.length + this.cameraUploaderDefectiveTicket.length > 10) {
            this.common.showToast('Maximum 10 files can be attached for Pictures of Defective Sample Received.');
            return false;
        }
        if (_claim.ActionRequested.RANumber && !this.isAlphaNumeric(_claim.ActionRequested.RANumber)) {
            this.common.showToast('Return Authorization should be a alphanumeric value with less than 10 characters.');
            return false;
        }
        if (_claim.ActionRequested.ICQuantity && !this.isValidNumber(_claim.ActionRequested.ICQuantity)) {
            this.common.showToast('Issue credit-Quantity should be a number value.');
            return false;
        }
        if (_claim.ActionRequested.ICQuantity > _claim.ProductDetails.NoOfDefectedItems) {
            this.common.showToast('Issue Credit Quantity should be less than No.of defective items.');
            return false;
        }
        if (_claim.ActionRequested.ICUnitCost && !this.unitCostValidation(_claim.ActionRequested.ICUnitCost)) {
            this.common.showToast('Unit cost is invalid.');
            return false;
        }
        if (_claim.ActionRequested.IssueCreditAdditionalCost && !this.unitCostValidation(_claim.ActionRequested.IssueCreditAdditionalCost)) {
            this.common.showToast('Additional cost is invalid.');
            return false;
        }
        if (_claim.ActionRequested.ReplacementQuantity && !this.isValidNumber(_claim.ActionRequested.ReplacementQuantity)) {
            this.common.showToast('Replacement-Quantity should be a number value.');
            return false;
        }
        if (_claim.ActionRequested.ReplacementQuantity > _claim.ProductDetails.NoOfDefectedItems) {
            this.common.showToast('No. of Replacement Quantity should be less than No.of defective items.');
            return false;
        }
        if (_claim.ActionRequested.ReplacementUnitCost && !this.unitCostValidation(_claim.ActionRequested.ReplacementUnitCost)) {
            this.common.showToast('Unit cost is invalid.');
            return false;
        }
        var Threshold = parseInt(this.currencyObject.Threshold);
        if (_claim.ActionRequested.IsCommertialAction == true && _claim.ClaimDetails.IsMajorClaim == false) {
            if (Number(_claim.ActionRequested.ICTotalCost) > Threshold) {
                this.common.showToast('Total cost should not exceed ' + this.currencyObject.CurrencySymbol + Threshold + ' for minor claims.');
                return false;
            }
        }
        return true;
    };
    /*Validations*/
    /* Regex validation for phone,email,number,alphanumeric*/
    //utility function for Invoice and PO number format 
    CreateClaimPage.prototype.invoiceFormaterUtility = function (mValue) {
        var filteredArray = [];
        var rawArray = [];
        rawArray = mValue.split(',');
        for (var inx in rawArray) {
            var temp = rawArray[inx];
            if (temp != '0' && temp.length <= 10 && temp.length >= 1) {
                filteredArray.push(temp);
            }
            else if (temp.length > 10) {
                temp = temp.trim();
                temp = temp.substring(0, 10);
                filteredArray.push(temp);
            }
            else { }
        }
        return filteredArray;
    };
    // Invoice and PO number format End
    CreateClaimPage.prototype.noCommercialClicked = function (_actionRequested) {
        _actionRequested.IsCommertialAction = false;
        _actionRequested.CAPAFlag = false;
        _actionRequested.IsRemarks = false;
        _actionRequested.Remarks = '';
    };
    CreateClaimPage.prototype.commercialClicked = function (_actionRequested) {
        _actionRequested.IsCommertialAction = true;
    };
    CreateClaimPage.prototype.minorOptionClick = function (_claimDetails) {
        _claimDetails.IsMajorClaim = false;
    };
    CreateClaimPage.prototype.majorOptionClick = function (_claimDetails) {
        _claimDetails.IsMajorClaim = true;
    };
    CreateClaimPage.prototype.issueCreditClick = function (_actionRequested) {
        if (_actionRequested.IsIssueCredit) {
            _actionRequested.IsReplacement = false;
        }
        _actionRequested.ICTotalCost = '';
        _actionRequested.ICUnitCost = '';
        _actionRequested.ICQuantity = '';
        _actionRequested.IssueCreditAdditionalCost = '';
    };
    CreateClaimPage.prototype.replacementClick = function (_actionRequested) {
        if (_actionRequested.IsReplacement) {
            _actionRequested.IsIssueCredit = false;
        }
        _actionRequested.ICTotalCost = '';
        _actionRequested.ICUnitCost = '';
        _actionRequested.ICQuantity = '';
        _actionRequested.IssueCreditAdditionalCost = '';
    };
    CreateClaimPage.prototype.issueCreditTotalCost = function (_actionRequested) {
        _actionRequested.ICTotalCost = ((_actionRequested.ICUnitCost * _actionRequested.ICQuantity) + Number(_actionRequested.IssueCreditAdditionalCost)).toFixed(4);
    };
    CreateClaimPage.prototype.issueReplacementTotalCost = function (_actionRequested) {
        _actionRequested.ReplacementTotalCost = (_actionRequested.ReplacementUnitCost * _actionRequested.ReplacementQuantity).toFixed(4);
    };
    CreateClaimPage.prototype.invFormatValidate = function (_obj) {
        _obj.InvoiceNumber = this.invoiceFormaterUtility(_obj.InvoiceNumber).join(",");
        _obj.PONumber = this.invoiceFormaterUtility(_obj.PONumber).join(",");
    };
    CreateClaimPage.prototype.phoneNumberValidation = function (number) {
        if (number) {
            var regex = /^((\+\d{1,2}|1)[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
            return regex.test(number);
        }
    };
    CreateClaimPage.prototype.isValidEmail = function (email) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };
    CreateClaimPage.prototype.isValidNumber = function (number) {
        var regex = /^[0-9]{1,12}$/;
        return regex.test(number);
    };
    CreateClaimPage.prototype.isValidNumbercomma = function (number) {
        var regex = /^[0-9, ]+$/;
        return regex.test(number);
    };
    CreateClaimPage.prototype.isAlphaNumeric = function (text) {
        var regex = /^[a-zA-Z0-9]+$/;
        return regex.test(text);
    };
    CreateClaimPage.prototype.unitCostValidation = function (price) {
        var regex = /^(?:\d*\.\d{1,4}|\d+)$/;
        return regex.test(price);
    };
    CreateClaimPage.prototype.isValidEmailIds = function (email) {
        var regex = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?)+$/;
        return regex.test(email);
    };
    CreateClaimPage.prototype.populateCountry = function (_SBUId) {
        for (var i = 0; i < this.dropDownData.SBUList.length; i++) {
            if (this.dropDownData.SBUList[i].SBUId === parseInt(_SBUId)) {
                this.claimObject.CustomerDetails.CountryID = this.dropDownData.SBUList[i].CountryID;
            }
        }
        /*Populate the currency based on county Id*/
        for (i = 0; i < this.dropDownData.Country.length; i++) {
            if (this.dropDownData.Country[i].CountryID === this.claimObject.CustomerDetails.CountryID) {
                //this.claimObject.ClaimDetails.InvoiceCurrency = this.dropDownData.Country[i].Currency;
                this.currencyObject = this.dropDownData.Country[i];
            }
        }
        this.distributionChannelList(_SBUId);
    };
    CreateClaimPage.prototype.distributionChannelList = function (_SBUId) {
        var _this = this;
        this.common.http.doGet(this.common.url.getDistributionChannelList(_SBUId), function (response) {
            if (response.ResponseCode === 200) {
                _this.dropDownData.DistributionChannelList = response.Data ? response.Data : [];
            }
        }, function (error) {
        });
    };
    CreateClaimPage.prototype.editClaimClicked = function () {
        this.isViewMode = false;
        this.isEditMode = true;
    };
    CreateClaimPage.prototype.resetClicked = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            message: 'Reset will clear all values entered before saving. Do you want to Continue?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: function () {
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        if (_this.claimObject.ComplaintNumber) {
                            _this.getClaimDetails(_this.claimObject.ComplaintNumber);
                        }
                        else {
                            _this.initilizeClaimObject();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    CreateClaimPage.prototype.presentPopover = function (_data) {
        var popover = this.popoverCtrl.create(TooltipPage, { data: _data }, { cssClass: 'my-custom-tooltip' });
        popover.present();
    };
    /*Begin Slider related function*/
    CreateClaimPage.prototype.gotoSlide = function (_slideNo) {
        this.stepNavigation = parseInt(_slideNo).toString();
    };
    CreateClaimPage.prototype.gotoPreviousSlide = function () {
        this.stepNavigation = (parseInt(this.stepNavigation) - 1).toString();
    };
    CreateClaimPage.prototype.gotoNextSlide = function (_claim) {
        if (this.isViewMode) {
            this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
            return false;
        }
        if (this.stepNavigation == 0) {
            if (!this.validateBasicDetails(_claim)) {
                return false;
            }
        }
        if (this.stepNavigation == 1) {
            if (!this.validateCustomerDetails(_claim)) {
                return false;
            }
        }
        if (this.stepNavigation == 2) {
            if (!this.validateProductDetails(_claim)) {
                return false;
            }
        }
        if (this.stepNavigation == 3) {
            if (!this.validateClaimDetails(_claim)) {
                return false;
            }
        }
        this.isSubmitted = false;
        this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
        this.stepsCompleted = (this.stepsCompleted < 5) ? (this.stepsCompleted + 1) : 5;
    };
    CreateClaimPage.prototype.gotoBackPage = function () {
        this.navCtrl.pop();
    };
    /*End Slider related function*/
    CreateClaimPage.prototype.initilizeClaimObject = function () {
        this.claimObject = {
            'ClaimAction': '',
            'CreatedBy': JSON.parse(localStorage.getItem("Weightage")).UserId,
            'ComplaintNumber': '',
            'InitiatorEmail': '',
            'PalletTicketAttachments': [],
            'InitiatorDetails': {
                'InitiatorName': localStorage.getItem("fullName"),
                'InitiatorPhone': '',
                'Extension': ''
            },
            'CustomerDetails': {
                'CustomerName': '',
                'CustomerNumber': '',
                'CountryID': '',
                'ContactPerson': '',
                'FinalCustomerName': '',
                'CustomerPhone': '',
                'Extn': '',
                'Email': '',
                'DistributionChannelID': '0',
                'ModeOfComplaintID': '0',
            },
            'ProductDetails': {
                'BrandID': '0',
                'SKUNumber': '',
                'InternalSKU': '',
                'ProductDescription': '',
                'ManufacturedBy': '',
                'DeliveryNumber': '',
                'NoOfDeliveredItems': '',
                'NoOfDefectedItems': '',
                'DeliveryDate': '',
                'ComplaintCategoryID': '0',
                'DrawingNumberRev': '',
            },
            'ActionRequested': {
                'IsIssueCredit': false,
                'IsRA': false,
                'IsReplacement': false,
                'IsRemarks': false,
                'RANumber': '',
                'ICUnitCost': '',
                'ICQuantity': '',
                'IssueCreditAdditionalCost': '',
                'ICTotalCost': '',
                'ReplacementUnitCost': '',
                'ReplacementQuantity': '',
                'ReplacementTotalCost': '',
                'Responsible': 1,
                'Remarks': '',
                'IsCommertialAction': false,
                'ComplaintStage': '',
                'ComplaintDesc': '',
                'IsDefSamplesReceived': false,
                'IsPicDefSamplesReceived': false,
                'ExpectedDateToReceiveSamples': '',
                'ExpDateRcvSamples': '',
                'CAPAFlag': false,
                'ReturnAuthUnitCost': '',
                'ReturnAuthQuantity': '',
                'ReturnAuthTotalCost': ''
            },
            'ClaimDetails': {
                'ActionRequestedID': '',
                'CreatedDate': new Date().toISOString(),
                'ClosedDate': '',
                'InvoiceNumber': '',
                'PONumber': '',
                'SBU_ID': '0',
                'IsMajorClaim': false,
                'ClaimTypeId': 1,
                'ClaimStatusID': '1',
                'Notes': '',
                'Feedback': '',
                'sendEmailsTo': '',
                'InvoiceValue': '',
                'InvoiceCurrency': '',
            }
        };
    };
    CreateClaimPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-create-claim',
            templateUrl: 'create-claim.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            CommonProvider,
            Constant,
            AlertController,
            FileTransfer,
            Camera,
            PopoverController])
    ], CreateClaimPage);
    return CreateClaimPage;
}());
export { CreateClaimPage };
//# sourceMappingURL=create-claim.js.map