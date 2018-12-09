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
import { AttachmentModalPage } from '../../../pages/modals/attachment-modal/attachment-modal';
import { FileUploader } from 'ng2-file-upload';
import { Constant } from '../../../providers/constant/constant';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
var AccidentPage = /** @class */ (function () {
    function AccidentPage(navCtrl, navParams, modalCtrl, common, constant, alertCtrl, transfer, camera, popoverCtrl) {
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
        this.typeOfEmployment = [];
        this.locationOfInjury = [];
        this.natureOfInjury = [];
        this.sendToList = [];
        this.isSubmitted = false;
        this.minDate = new Date().toISOString();
        this.claimId = '';
        this.claimStatus = '';
        this.isViewMode = true;
        this.isEditMode = false;
        this.stepNavigation = '0';
        this.stepsCompleted = 0;
        this.cameraUploader = [];
        this.imageUploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
        this.palletTicketFileUploadDetail = [];
        this.URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
        this.common.hideLoader();
        this.initilizeClaimObject();
        this.claimObject.ReferenceNo = this.navParams.get('complaintNumber');
        this.isViewMode = this.navParams.get('isViewMode');
        this.getAllDropdownData();
        this.fileUploadInitilize();
    }
    AccidentPage.prototype.ngAfterViewInit = function () {
    };
    AccidentPage.prototype.uploadFromCamera = function (_imageURI, _serverURL, _successCallback, _errorCallBack) {
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
    AccidentPage.prototype.onInitPalletCamera = function (event) {
        var _this = this;
        var cameraOptions = {
            quality: 15,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            _this.cameraUploader.push(imageData);
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
    AccidentPage.prototype.fileUploadInitilize = function () {
        var _this = this;
        this.imageUploader = new FileUploader({ url: this.URL });
        this.imageUploader.onAfterAddingFile = function (fileItem) {
            _this.fileslengthPallet = _this.imageUploader.queue.length;
            _this.palletTicketFileUploadDetail.push(fileItem.file);
            fileItem.withCredentials = false;
        };
        this.imageUploader.onCompleteItem = function (item, response, status, headers) {
            console.log(response);
        };
    };
    /*Show the attachment Modal for Pallet, Carton etc., */
    AccidentPage.prototype.showAttachmentdModal = function (_fileUploadDetails, _uploaderQueue, _cameraUploader, _claimObject, _key) {
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
    AccidentPage.prototype.uploadAllImages = function (_referenceNo, _action) {
        var _this = this;
        /*Upload images captured from the camera*/
        if (this.cameraUploader.length <= 10) {
            for (var index = 0; index < this.cameraUploader.length; index++) {
                var _file = this.cameraUploader[index];
                this.uploadFromCamera(_file, this.common.url.uploadAccidentImages(_referenceNo), function (res) {
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
        for (var index = 0; index < this.imageUploader.queue.length; index++) {
            var element = this.imageUploader.queue[index];
            if (element.url !== undefined) {
                element.url = this.common.url.uploadAccidentImages(_referenceNo);
            }
        }
        if (this.imageUploader.queue.length > 0) {
            this.imageUploader.uploadAll();
        }
        setTimeout(function () {
            _this.common.hideLoader();
            _this.navCtrl.pop();
        }, 3000);
    };
    AccidentPage.prototype.ionViewDidLoad = function () {
        if (this.isViewMode)
            this.stepsCompleted = 3;
    };
    AccidentPage.prototype.getAllDropdownData = function () {
        var _this = this;
        this.common.showLoader();
        this.common.http.doGet(this.common.url.getEmployementType(), function (response) {
            _this.typeOfEmployment = response ? response : [];
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
            _this.common.showToast('Oops! something went wrong.');
        });
        this.common.http.doGet(this.common.url.getSendTo(), function (response) {
            _this.sendToList = response ? response : [];
        }, function (error) {
            _this.common.showToast('Oops! something went wrong.');
        });
        this.common.http.doGet(this.common.url.getInjuryLocation(), function (response) {
            _this.locationOfInjury = response ? response : [];
        }, function (error) {
            _this.common.showToast('Oops! something went wrong.');
        });
        this.common.http.doGet(this.common.url.getInjuryNature(), function (response) {
            _this.natureOfInjury = response ? response : [];
        }, function (error) {
            _this.common.showToast('Oops! something went wrong.');
        });
        if (this.claimObject.ReferenceNo) {
            this.getClaimDetails(this.claimObject.ReferenceNo);
            return;
        }
    };
    AccidentPage.prototype.getClaimDetails = function (referenceNo) {
        var _this = this;
        this.common.http.doGet(this.common.url.getAccidentClaim(referenceNo), function (response) {
            if (response.ResponseCode === 200 && response.Data) {
                _this.claimObject = response.Data;
                _this.palletTicketFileUploadDetail = [];
                if (_this.claimObject.InjuryDetail.Attachment && _this.claimObject.InjuryDetail.Attachment.length) {
                    for (var i = 0; i < _this.claimObject.InjuryDetail.Attachment.length; i++) {
                        _this.palletTicketFileUploadDetail.push({ 'name': _this.claimObject.InjuryDetail.Attachment[i].FileName, 'path': _this.claimObject.InjuryDetail.Attachment[i].FilePath, 'AttachmentID': _this.claimObject.InjuryDetail.Attachment[i].AttachmentID });
                    }
                }
                /*this.claimObject.ClaimDetails.SBU_ID = response.Data.ClaimDetails.SBU.SBUId;
                this.claimObject.ActionRequested.Responsible = 1;
                this.claimObject.CustomerDetails.DistributionChannelID = response.Data.CustomerDetails.DistributionChannel.ChannelID;
                this.claimObject.CustomerDetails.ModeOfComplaintID = response.Data.CustomerDetails.ComplaintMode.ModeID;*/
            }
            _this.common.hideLoader();
        }, function (error) {
            _this.common.hideLoader();
        });
    };
    AccidentPage.prototype.validateAndSubmitClaim = function (_claim, _action) {
        if (!this.validateBasicDetails(_claim)) {
            this.gotoSlide(0);
            return false;
        }
        if (!this.validateIncidentDetails(_claim)) {
            this.gotoSlide(1);
            return false;
        }
        if (!this.validateInjuryDetails(_claim)) {
            this.gotoSlide(2);
            return false;
        }
        this.draftOrSubmitClaim(_claim, _action);
    };
    AccidentPage.prototype.draftOrSubmitClaim = function (_claim, _action) {
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
    /*Validate each sections*/
    AccidentPage.prototype.validateBasicDetails = function (_claim) {
        this.isSubmitted = true;
        if (!_claim.IncidentDate) {
            this.common.showToast('Please choose Incident Date.');
            return false;
        }
        if (!_claim.IncidentTime) {
            this.common.showToast('Please choose Incident Time.');
            return false;
        }
        if (!_claim.EmployeeName) {
            this.common.showToast('Please enter Employee name.');
            return false;
        }
        if (!_claim.EmploymentTypeId) {
            this.common.showToast('Please select Type of Employment.');
            return false;
        }
        return true;
    };
    AccidentPage.prototype.validateIncidentDetails = function (_claim) {
        this.isSubmitted = true;
        if (!_claim.IncidentDetail.SendToId) {
            this.common.showToast('Please choose Sent to.');
            return false;
        }
        if (!_claim.IncidentDetail.ReportedBy) {
            this.common.showToast('Please enter Incident Reported By.');
            return false;
        }
        if (!_claim.IncidentDetail.ReportedBy) {
            this.common.showToast('Please enter Incident Reported By.');
            return false;
        }
        if (!_claim.IncidentDetail.Location) {
            this.common.showToast('Please enter Precise location of the Incident.');
            return false;
        }
        if (!_claim.IncidentDetail.Description) {
            this.common.showToast('Please enter Description of Incident.');
            return false;
        }
        if (_claim.IncidentDetail.EmailTo && !this.isValidEmailIds(_claim.IncidentDetail.EmailTo)) {
            this.common.showToast('Please enter valid email Ids.');
            return false;
        }
        return true;
    };
    AccidentPage.prototype.validateInjuryDetails = function (_claim) {
        this.isSubmitted = true;
        if (!_claim.InjuryDetail.InjuryNatureId) {
            this.common.showToast('Please choose Nature of Injury.');
            return false;
        }
        if (!_claim.InjuryDetail.InjuryLocationId) {
            this.common.showToast('Please choose Location of Injury.');
            return false;
        }
        return true;
    };
    AccidentPage.prototype.isValidEmailIds = function (email) {
        var regex = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?)+$/;
        return regex.test(email);
    };
    /*Validations*/
    AccidentPage.prototype.editClaimClicked = function () {
        this.isViewMode = false;
        this.isEditMode = true;
    };
    AccidentPage.prototype.resetClicked = function () {
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
    /*Begin Slider related function*/
    AccidentPage.prototype.gotoSlide = function (_slideNo) {
        this.stepNavigation = parseInt(_slideNo).toString();
    };
    AccidentPage.prototype.gotoPreviousSlide = function () {
        this.stepNavigation = (parseInt(this.stepNavigation) - 1).toString();
    };
    AccidentPage.prototype.gotoNextSlide = function (_claim) {
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
            if (!this.validateIncidentDetails(_claim)) {
                return false;
            }
        }
        if (this.stepNavigation == 2) {
            if (!this.validateInjuryDetails(_claim)) {
                return false;
            }
        }
        this.isSubmitted = false;
        this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
        this.stepsCompleted = (this.stepsCompleted < 3) ? (this.stepsCompleted + 1) : 3;
    };
    AccidentPage.prototype.gotoBackPage = function () {
        this.navCtrl.pop();
    };
    /*End Slider related function*/
    AccidentPage.prototype.initilizeClaimObject = function () {
        this.claimObject = {
            "ReferenceNo": "",
            "IncidentDate": new Date().toISOString(),
            "IncidentTime": new Date().toISOString(),
            "InternalClaimTypeId": 1,
            "EmployeeName": "",
            "EmployeeNo": "",
            "EmploymentTypeId": "",
            "EmplyeeMinCo": "",
            "ClaimStatusId": 1,
            "IncidentDetail": {
                "SendToId": "",
                "ReportedBy": "",
                "Location": "",
                "Description": "",
                "ImmediateAction": "",
                "EmailTo": ""
            },
            "InjuryDetail": {
                "InjuryNatureId": "",
                "InjuryLocationId": "",
                "Ppe": "",
                "CarClosedBy": localStorage.getItem("fullName"),
                "CarClosedDate": new Date().toISOString(),
                "Attachment": []
            }
        };
    };
    AccidentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-accident',
            templateUrl: 'accident.html',
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
    ], AccidentPage);
    return AccidentPage;
}());
export { AccidentPage };
//# sourceMappingURL=accident.js.map