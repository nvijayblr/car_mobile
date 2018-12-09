import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { InvoiceModalPage } from '../../../pages/modals/invoice-modal/invoice-modal'
import { AttachmentModalPage } from '../../../pages/modals/attachment-modal/attachment-modal'
import { FileUploader } from 'ng2-file-upload';
import { Constant } from '../../../providers/constant/constant'
import { TooltipPage } from '../../modals/tooltip/tooltip'
import { TranslateService } from '@ngx-translate/core';

import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-hazard',
  templateUrl: 'hazard.html',
})
export class HazardPage {

// @ViewChild('input') myInput ;
  public claimObject:any = {};
  public claimStatusList = [];
  public hazardsNaturesList = [];
  public hazardPriorityList = [];
  public sendToList = [];

  public isSubmitted = false;
  public minDate = new Date().toISOString();
  public claimId = '';
  public claimStatus = '';

  public isViewMode = true;
  public isEditMode = false;

  public stepNavigation:any = '0';
  public stepsCompleted:number = 0;

  public cameraUploader = [];
  public imageUploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  public imageUploaderDetail = [];
  public fileslengthPallet;
  public URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
  public translation:any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public common:CommonProvider,
    public constant: Constant,
    public alertCtrl: AlertController,
    private transfer: FileTransfer,
    private camera: Camera,
    public popoverCtrl: PopoverController, public translate: TranslateService ) {
      this.common.hideLoader();
      this.initilizeClaimObject();
      this.claimObject.ReferenceNo = this.navParams.get('complaintNumber');
      this.isViewMode = this.navParams.get('isViewMode');
      this.getAllDropdownData();
      this.fileUploadInitilize();
      this.getTranslateMessages();
  }

  	ngAfterViewInit() {
  	}

    ionViewDidLoad() {
      if(this.isViewMode) this.stepsCompleted = 3;
    }

    uploadFromCamera(_imageURI?: string, _serverURL?:string, _successCallback?:any, _errorCallBack?:any) {
      const _fileTransfer:any = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: _imageURI.substr(_imageURI.lastIndexOf('/') + 1),
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
      _fileTransfer.upload(_imageURI, _serverURL, options).then((result: any) => {
          console.log('result');
      }, (err) => {
          alert('Error uploading file.')
      });
    }

    /*Initilize the onInitAttachmentCamera*/
    public onInitAttachmentCamera(event) {
        const cameraOptions = {
          quality: 15,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
          this.cameraUploader.push(imageData);
          var _attachObj = {
              name: imageData.split('/').pop(),
              source: 'camera',
              FilePath: imageData,
              FileName: imageData.split('/').pop()
          }
          this.imageUploaderDetail.push(_attachObj);
        }, (err) => {
            console.log(err);
        });
    }

  fileUploadInitilize() {
    this.imageUploader = new FileUploader({ url: this.URL });
    this.imageUploader.onAfterAddingFile = (fileItem) => {
      this.fileslengthPallet = this.imageUploader.queue.length;
      this.imageUploaderDetail.push(fileItem.file);
      fileItem.withCredentials = false;
    };
    this.imageUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
    };
  }

  /*Show the attachment Modal for Pallet, Carton etc., */
  showAttachmentdModal(_fileUploadDetails, _uploaderQueue, _cameraUploader, _claimObject, _key) {
    let attachmentModal = this.modalCtrl.create(AttachmentModalPage, {
      attachments: _fileUploadDetails.length ? _fileUploadDetails : [], 
      queue: _uploaderQueue.length ? _uploaderQueue : [], 
      camera: _cameraUploader.length ? _cameraUploader : [],
      claimObj: _claimObject.length ? _claimObject : [],
      key: _key,
      videMode: this.isViewMode,
      source: 'accident'
    });
    attachmentModal.present();
    attachmentModal.onDidDismiss(deletedImages => {
    });
  }

  //calluploadAllfile
  uploadAllImages(_referenceNo, _action): void {

    /*Upload images captured from the camera*/
    if(this.cameraUploader.length <= 10) {
      for (let index = 0; index < this.cameraUploader.length; index++) {
        const _file = this.cameraUploader[index];
        this.uploadFromCamera(_file, this.common.url.uploadHazardImages(_referenceNo), (res) => {
          console.log('File uploaded successfully.');
        }, (err) => {
          console.log(err);
          alert('Error while uploading the file, please try again.');
        });
      }
    } else {
      this.common.showToast('Can upload only 10 files');
    }

    for (let index = 0; index < this.imageUploader.queue.length; index++) {
      const element = this.imageUploader.queue[index];
      if (element.url !== undefined) {
        element.url = this.common.url.uploadHazardImages(_referenceNo);
      }
    }
    if (this.imageUploader.queue.length > 0) {
      this.imageUploader.uploadAll();
    }
    setTimeout(()=> {
      this.common.hideLoader();
      this.navCtrl.pop();
    }, 3000);
  }


  getAllDropdownData(): void {

    this.common.showLoader();

    this.common.http.doGet(this.common.url.getInternalClaimStatus(), response => {
      this.claimStatusList = response ? response : [];
      this.common.hideLoader();
    }, error => {
      this.common.showToast(this.translation.networkError);
      this.common.hideLoader();
    });

    this.common.http.doGet(this.common.url.getHazardNature(), response => {
      this.hazardsNaturesList = response ? response : [];
    }, error => {
    });

    this.common.http.doGet(this.common.url.getSendTo(), response => {
      this.sendToList = response ? response : [];
    }, error => {
    });

    this.common.http.doGet(this.common.url.getEstimatedPriority(), response => {
      this.hazardPriorityList = response ? response : [];
    }, error => {
    });
    
    if(this.claimObject.ReferenceNo) {
      this.getClaimDetails(this.claimObject.ReferenceNo);
      return;
    }    
  }

  getClaimDetails(referenceNo): void {
    this.common.http.doGet(this.common.url.getHazardClaim(referenceNo), response => {
      if(response.StatusCode == 'SUCCESS') {
        this.claimObject = response ? response.Data : {};
        if(!this.claimObject.HazardDetail.HazardNatureId) {
          this.claimObject.HazardDetail.HazardNatureId = '';
        }
        if(!this.claimObject.CorrectiveAction.SendTo) {
          this.claimObject.CorrectiveAction.SendTo = '';
        }
        if(!this.claimObject.CorrectiveAction.EstimatedPriority) {
          this.claimObject.CorrectiveAction.EstimatedPriority = '';
        }
        if(this.claimObject.CorrectiveAction.CarClosedDate) {
          this.claimObject.CorrectiveAction.CarClosedDate = moment(this.claimObject.CorrectiveAction.CarClosedDate).format('MM/DD/YYYY');
        }
        this.imageUploaderDetail = [];
        if (this.claimObject.CorrectiveAction.Attachment && this.claimObject.CorrectiveAction.Attachment.length) {
            for (let i = 0; i < this.claimObject.CorrectiveAction.Attachment.length; i++) {
              this.imageUploaderDetail.push({ 'name': this.claimObject.CorrectiveAction.Attachment[i].FileName, 'path': this.claimObject.CorrectiveAction.Attachment[i].FilePath, 'AttachmentID': this.claimObject.CorrectiveAction.Attachment[i].AttachmentID })
            }
        }
      }
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
    });
  }


  validateAndSubmitClaim(_claim, _action) {
    if(!this.validateBasicDetails(_claim)) {
      this.gotoSlide(0);
      return false;
    }
    
    if(!this.validateHazardDetails(_claim)) {
      this.gotoSlide(1);
      return false;
    }
    
    if(!this.validateCorrectiveAction(_claim)) {
      this.gotoSlide(2);
      return false;
    }
    
    this.draftOrSubmitClaim(_claim, 2); //1 is Draft and 2 is Submit Claim
  }

  draftOrSubmitClaim(_claim, _action) {
    _claim.ClaimStatusId = _action;
    let postUrl = this.common.url.createHazardClaim();
    if(_claim.ReferenceNo) {
      postUrl = this.common.url.updateHazardClaim();
    } 
    this.common.showLoader();
    this.common.http.doPost(postUrl, _claim, response => {
        if (response.Message) {
          if(_claim.ReferenceNo) {
            this.common.showToast(this.translation.claim +_claim.ReferenceNo+ this.translation.updateSuccess, 'success');
          } else {
            this.common.showToast(this.translation.claim +response.Message+ this.translation.saveSuccess, 'success');
            _claim.ReferenceNo = response.Message;
          }
          this.uploadAllImages(_claim.ReferenceNo, _action);
        }
    }, error => {
      this.common.hideLoader();
    });

  }

  /*Validate each sections*/

  validateBasicDetails(_claim) {
    this.isSubmitted = true;
    if(!_claim.ObservedDate) {
      this.common.showToast(this.translation.dateOfObservation);
      return false;
    }
    if(!_claim.EmployeeName) {
      this.common.showToast(this.translation.employeeName);
      return false;
    }
    return true;
  }


  validateHazardDetails(_claim) {
    this.isSubmitted = true;
    if(!_claim.HazardDetail.Location) {
      this.common.showToast(this.translation.location);
      return false;
    }
    if(!_claim.HazardDetail.HazardNatureId) {
      this.common.showToast(this.translation.natureOfHazard);
      return false;
    }
    if(!_claim.HazardDetail.Description) {
      this.common.showToast(this.translation.description);
      return false;
    }
    return true;
  }

  validateCorrectiveAction(_claim) {
    this.isSubmitted = true;
    if(!_claim.CorrectiveAction.ActionRequested) {
      this.common.showToast(this.translation.correctiveActionRequested);
      return false;
    }

    if(!_claim.CorrectiveAction.SendTo) {
      this.common.showToast(this.translation.sendTo);
      return false;
    }

    if(!_claim.CorrectiveAction.EstimatedPriority) {
      this.common.showToast(this.translation.estimatedPriority);
      return false;
    }

    if(_claim.CorrectiveAction.EmailTo && !this.isValidEmailIds(_claim.CorrectiveAction.EmailTo)) {
      this.common.showToast(this.translation.validEmail);
      return false;
    }

    return true;
  }

  isValidEmailIds(email): boolean {
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var result = email.split(',');
    if(!email.length) return true;      
    for(var i = 0;i < result.length;i++) {
        if(!result[i] || !regex.test(result[i])) {
            return false;
        }
    }       
    return true;
  }
  /*Validations*/


  editClaimClicked() {
    this.isViewMode = false;
    this.isEditMode = true;
  }

  resetClicked() {
    let alert = this.alertCtrl.create({
      message: this.translation.resetFormModal,
      buttons: [
        {
          text: this.translation.no,
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: this.translation.yes,
          handler: () => {
            if(this.claimObject.ReferenceNo) {
              this.getClaimDetails(this.claimObject.ReferenceNo);
            } else {
              this.initilizeClaimObject();
            }
          }
        }
      ]
    });
    alert.present();
  }

  /*Begin Slider related function*/

  gotoSlide(_slideNo): void {
    this.stepNavigation = parseInt(_slideNo).toString();
  }

  gotoPreviousSlide():void {
    this.stepNavigation = (parseInt(this.stepNavigation) - 1).toString();
  }

  gotoNextSlide(_claim) {
    if(this.isViewMode) {
      this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
      return false;
    }

    if(this.stepNavigation == 0) {
      if( !this.validateBasicDetails(_claim)) {
        return false;
      }
    }
    
    if(this.stepNavigation == 1) {
      if(!this.validateHazardDetails(_claim)) {
        return false;
      } 
    }
    
    if(this.stepNavigation == 2) {
      if(!this.validateCorrectiveAction(_claim)) {
          return false;
      } 
    }
    
    this.isSubmitted = false;
    this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
    this.stepsCompleted = (this.stepsCompleted < 3) ? (this.stepsCompleted + 1) : 3;
  } 


  gotoBackPage() {
    this.navCtrl.pop();
  }
  /*End Slider related function*/

  initilizeClaimObject() {
    this.claimObject = {
     "ReferenceNo":'',
     "ObservedDate" : new Date().toISOString(),
     "EmployeeName": '',
     "EmployeeNo": '',
     "EmplyeeMinCo": '',
     "InternalClaimTypeId":2,
     "ClaimStatusId": '1',
     "HazardDetail":{
        "Location":  '',
        "HazardNatureId": '',
        "Description": '',
    },
     "CorrectiveAction":{
       "ActionRequested": '',
       "SendTo": '',
       "EstimatedPriority": '',
       "EmailTo":"",
       "CarClosedBy": '',
       "CarClosedDate": '',
       "Attachment":[],
     }
    };
  }

  getTranslateMessages() {
    this.translate.get('common.resetFormModal').subscribe(value => {
        this.translation.resetFormModal = value;
    });
    this.translate.get('common.yes').subscribe(value => {
        this.translation.yes = value;
    });
    this.translate.get('common.no').subscribe(value => {
        this.translation.no = value;
    });
    this.translate.get('common.claim').subscribe(value => {
        this.translation.claim = value;
    });
    this.translate.get('common.saveSuccess').subscribe(value => {
        this.translation.saveSuccess = value;
    });
    this.translate.get('common.updateSuccess').subscribe(value => {
        this.translation.updateSuccess = value;
    });
    this.translate.get('common.submitSuccess').subscribe(value => {
        this.translation.submitSuccess = value;
    });
    this.translate.get('common.networkError').subscribe(value => {
        this.translation.networkError = value;
    });

    this.translate.get('hazard.validation.dateOfObservation').subscribe(value => {
        this.translation.dateOfObservation = value;
    });
    this.translate.get('hazard.validation.employeeName').subscribe(value => {
        this.translation.employeeName = value;
    });

    this.translate.get('hazard.validation.location').subscribe(value => {
        this.translation.location = value;
    });
    this.translate.get('hazard.validation.natureOfHazard').subscribe(value => {
        this.translation.natureOfHazard = value;
    });
    this.translate.get('hazard.validation.description').subscribe(value => {
        this.translation.description = value;
    });

    this.translate.get('hazard.validation.correctiveActionRequested').subscribe(value => {
        this.translation.correctiveActionRequested = value;
    });
    this.translate.get('hazard.validation.sendTo').subscribe(value => {
        this.translation.sendTo = value;
    });
    this.translate.get('hazard.validation.estimatedPriority').subscribe(value => {
        this.translation.estimatedPriority = value;
    });
    this.translate.get('hazard.validation.validEmail').subscribe(value => {
        this.translation.validEmail = value;
    });

    this.translate.get('hazard.validation.dateOfIncidentToaster').subscribe(value => {
        this.translation.dateOfIncidentToaster = value;
    });
    this.translate.get('hazard.validation.claim').subscribe(value => {
        this.translation.claim = value;
    });
    this.translate.get('hazard.validation.saveSuccess').subscribe(value => {
        this.translation.saveSuccess = value;
    });
    this.translate.get('hazard.validation.updateSuccess').subscribe(value => {
        this.translation.updateSuccess = value;
    });
    this.translate.get('hazard.validation.submitSuccess').subscribe(value => {
        this.translation.submitSuccess = value;
    });
  }

}
