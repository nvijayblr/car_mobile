import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, PopoverController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common'
import { InvoiceModalPage } from '../../../pages/modals/invoice-modal/invoice-modal'
import { AttachmentModalPage } from '../../../pages/modals/attachment-modal/attachment-modal'
import { FileUploader } from 'ng2-file-upload';
import { Constant } from '../../../providers/constant/constant'
import { TooltipPage } from '../../modals/tooltip/tooltip'
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-create-claim',
  templateUrl: 'create-claim.html',
})
export class CreateClaimPage {
 
// @ViewChild('input') myInput ;
  public claimObject:any = {};
  public errorFields:any = {};

  public claimStatusList = [];
  public dropDownData:any = [];
  public invoiceDetails:any = {};
  public isSubmitted = false;
  public minDate = new Date().toISOString();
  public claimId = '';
  public claimStatus = '';
  public currencyObject = {
    'Type':'',
    'CurrencySymbol':'',
    'Threshold':'',
    'ContactFormat':'',
    'RegexString':[]
  };

  public isViewMode = true;
  public isEditMode = false;

  public stepNavigation:any = '0';
  public stepsCompleted:number = 0;

  public cameraUploaderPalletTicket = [];
  public cameraUploaderCartonTicket = [];
  public cameraUploaderDefectiveTicket = [];

  public uploaderPalletTicket: FileUploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  public uploadermasterCartonBarcode: FileUploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  public uploaderdefectiveSampleAttach: FileUploader = new FileUploader({ url: 'https://evening-anchorage-3159.herokuapp.com/api/' });
  public palletTicketFileUploadDetail = [];
  public masterCartonBarcodeFileUploadDetail = [];
  public uploaderDefectiveDetail = [];
  public palletStorageAfterChange = [];
  public cartonStorageAfterChange = [];
  public uploaderDefectiveAfterChange = [];
  public fileslengthPallet;
  public fileslengthMaster;
  public fileslengthDefectiveSampleReceived;
  public URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
  public claimKeyVal = '';
  public majorMinorClaim = 'minor';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public common:CommonProvider,
    public constant: Constant,
    public alertCtrl: AlertController,
    private transfer: FileTransfer,
    private camera: Camera,
    public popoverCtrl: PopoverController ) {
      this.common.hideLoader();
      this.initilizeClaimObject();
      this.claimObject.ComplaintNumber = this.navParams.get('complaintNumber');
      this.isViewMode = this.navParams.get('isViewMode');
      this.claimObject.ClaimDetails.ClaimTypeId = this.navParams.get('claimTypeId') ? this.navParams.get('claimTypeId') : '4';
      this.getAllDropdownData();
      this.fileUploadInitilize();
  }

 ngAfterViewInit() {
 }
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
          alert(err)
      });
    }

    /*Initilize the onInitPalletCamera*/
    public onInitPalletCamera(event) {
        const cameraOptions = {
          quality: 15,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
          this.cameraUploaderPalletTicket.push(imageData);
          var _attachObj = {
              name: imageData.split('/').pop(),
              source: 'camera',
              FilePath: imageData,
              FileName: imageData.split('/').pop()
          }
          this.palletTicketFileUploadDetail.push(_attachObj);
        }, (err) => {
            console.log(err);
        });
    }

    /*Initilize the onInitCartonCamera*/
    public onInitCartonCamera(event) {
        const cameraOptions = {
          quality: 15,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
          this.cameraUploaderCartonTicket.push(imageData);
          var _attachObj = {
              name: imageData.split('/').pop(),
              source: 'camera',
              FilePath: imageData,
              FileName: imageData.split('/').pop()
          }
          this.masterCartonBarcodeFileUploadDetail.push(_attachObj);
        }, (err) => {
            console.log(err);
        });
    }

    /*Initilize the onInitDefectiveCamera*/
    public onInitDefectiveCamera(event) {
        const cameraOptions = {
          quality: 15,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          saveToPhotoAlbum: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
          this.cameraUploaderDefectiveTicket.push(imageData);
          var _attachObj = {
              name: imageData.split('/').pop(),
              source: 'camera',
              FilePath: imageData,
              FileName: imageData.split('/').pop()
          }
          this.uploaderDefectiveDetail.push(_attachObj);
        }, (err) => {
            console.log(err);
        });
    }

  fileUploadInitilize() {
    this.uploaderPalletTicket = new FileUploader({ url: this.URL });
    this.uploaderPalletTicket.onAfterAddingFile = (fileItem) => {
      this.fileslengthPallet = this.uploaderPalletTicket.queue.length;
      this.palletTicketFileUploadDetail.push(fileItem.file);
      fileItem.withCredentials = false;
    };
    this.uploaderPalletTicket.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
    };

    this.uploadermasterCartonBarcode = new FileUploader({ url: this.URL });
    this.uploadermasterCartonBarcode.onAfterAddingFile = (fileItem) => {
      this.fileslengthMaster = this.uploadermasterCartonBarcode.queue.length;
      this.masterCartonBarcodeFileUploadDetail.push(fileItem.file);
      fileItem.withCredentials = false;
    };
    this.uploadermasterCartonBarcode.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    };

    this.uploaderdefectiveSampleAttach = new FileUploader({ url: this.URL });
    this.uploaderdefectiveSampleAttach.onAfterAddingFile = (fileItem) => {
      this.fileslengthDefectiveSampleReceived = this.uploaderdefectiveSampleAttach.queue.length;
      this.uploaderDefectiveDetail.push(fileItem.file);
      fileItem.withCredentials = false;
    };
    this.uploaderdefectiveSampleAttach.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
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
      videMode: this.isViewMode
    });
    attachmentModal.present();
    attachmentModal.onDidDismiss(deletedImages => {

    });
  }

  //calluploadAllfile
  uploadAllImages(_claimId, _action): void {

    /*Upload images captured from the camera*/
    if(this.cameraUploaderPalletTicket.length <= 10) {
      for (let index = 0; index < this.cameraUploaderPalletTicket.length; index++) {
        const _file = this.cameraUploaderPalletTicket[index];
        const _serverUrl = this.common.url.getFileUploadURL(_claimId, 'palletKey');
        this.uploadFromCamera(_file, _serverUrl, (res) => {
          console.log('File uploaded successfully.');
        }, (err) => {
          console.log(err);
          alert('Error while uploading the file, please try again.');
        });
      }
    } else {
      this.common.showToast('Can upload only 10 files');
    }

    /*Upload images captured from the camera*/
    for (let index = 0; index < this.cameraUploaderCartonTicket.length; index++) {
      const _file = this.cameraUploaderCartonTicket[index];
      const _serverUrl = this.common.url.getFileUploadURL(_claimId, 'mcbKey');
      this.uploadFromCamera(_file, _serverUrl, (res) => {
        console.log('File uploaded successfully.');
      }, (err) =>{
        console.log(err);
        alert('Error while uploading the file, please try again.');
      });
    }

    /*Upload images captured from the camera*/
    for (let index = 0; index < this.cameraUploaderDefectiveTicket.length; index++) {
      const _file = this.cameraUploaderDefectiveTicket[index];
      const _serverUrl = this.common.url.getFileUploadURL(_claimId, 'claimKey');
      this.uploadFromCamera(_file, _serverUrl, (res) => {
        console.log('File uploaded successfully.');
      }, (err) =>{
        console.log(err);
        alert('Error while uploading the file, please try again.');
      });
    }

    for (let index = 0; index < this.uploaderPalletTicket.queue.length; index++) {
      const element = this.uploaderPalletTicket.queue[index];
      if (element.url !== undefined) {
        element.url = this.common.url.getFileUploadURL(_claimId, 'palletKey');
      }
    }
    for (let index = 0; index < this.uploadermasterCartonBarcode.queue.length; index++) {
      const element = this.uploadermasterCartonBarcode.queue[index];
      if (element.url !== undefined) {
        element.url = this.common.url.getFileUploadURL(_claimId, 'mcbKey');
      }
    }
    for (let index = 0; index < this.uploaderdefectiveSampleAttach.queue.length; index++) {
      const element = this.uploaderdefectiveSampleAttach.queue[index];
      if (element.url !== undefined) {
        element.url = this.common.url.getFileUploadURL(_claimId, 'claimKey');
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
    
    setTimeout(()=> {
      this.common.hideLoader();
      this.navCtrl.pop();
    }, 3000);
  }


  ionViewDidLoad() {
    if(this.isViewMode) this.stepsCompleted = 5;
  }

  getAllDropdownData(): void {
    this.common.showLoader();
    forkJoin([
      this.common.http.forkGet(this.common.url.getSBUListURL()), 
      this.common.http.forkGet(this.common.url.getComplaintCategoryListURL()), 
      this.common.http.forkGet(this.common.url.getModeOfComplaintListURL()), 
      this.common.http.forkGet(this.common.url.getCountryURL()), 
      this.common.http.forkGet(this.common.url.getBrandListURL())
      ]).subscribe(results => {

        let dataObject:any = results[0];
        this.dropDownData.SBUList = dataObject.Data ? dataObject.Data : [];
        
        dataObject = results[1];
        this.dropDownData.ComplaintCategoryList = dataObject.Data ? dataObject.Data : [];

        dataObject = results[2];
        this.dropDownData.ModeOfComplaintList = dataObject.Data ? dataObject.Data : [];
        
        dataObject = results[3];
        this.dropDownData.Country = dataObject.Data ? dataObject.Data : [];
        
        dataObject = results[4];
        this.dropDownData.BrandList = dataObject.Data ? dataObject.Data : [];
        
        this.claimObject.ClaimDetails.SBUId =this.dropDownData.SBUList[0].SBUId;

        if(this.claimObject.ComplaintNumber) {
          this.getClaimDetails(this.claimObject.ComplaintNumber);
          return;
        } else {
          this.populateCountry(this.claimObject.ClaimDetails.SBUId);
          /*Get the Initiator Name, Phone number and extension.*/
          this.common.http.doGet(this.common.url.getWeightageListURL(), response => {
            if(response.Data) {
              this.claimObject.InitiatorDetails.InitiatorName = response.Data.FullName;
              this.claimObject.InitiatorDetails.InitiatorPhone = response.Data.PhoneNumber;
              this.claimObject.InitiatorDetails.Extension = response.Data.Extn;
            }
            this.common.hideLoader();
          }, error => {
            this.common.hideLoader();
          });

        }
      }, error => {
        this.common.hideLoader();
        if(error && error.status == 401 && error.statusText == 'Unauthorized') {
          this.common.showToast('Unauthorized access.', 'error');
          this.common.http.doLogout();
          return;
        }
        this.common.showToast('Oops! something went wrong.')
      });

    /*this.common.http.doGet(this.common.url.getAllDropDownDataURL(), response => {
      if (response.ResponseCode === 200 && response.Data) {
        this.dropDownData = response.Data;
        this.claimObject.ClaimDetails.SBUId =this.dropDownData.SBUList[0].SBUId;
        this.populateCountry(this.claimObject.ClaimDetails.SBUId);
        if(this.claimObject.ComplaintNumber) {
          this.getClaimDetails(this.claimObject.ComplaintNumber);
          return;
        } else {
          this.common.http.doGet(this.common.url.getWeightageListURL(), response => {
            if(response.Data) {
              this.claimObject.InitiatorDetails.InitiatorName = response.Data.FullName;
              this.claimObject.InitiatorDetails.InitiatorPhone = response.Data.PhoneNumber;
              this.claimObject.InitiatorDetails.Extension = response.Data.Extn;
            }
            this.common.hideLoader();
          }, error => {
            this.common.hideLoader();
          });

        }
      }
    }, error => {
      this.common.hideLoader();
    });*/
  }

  getClaimDetails(complaintNumber): void {
    this.common.http.doGet(this.common.url.getClaimDetailsURL(complaintNumber), response => {
      console.log(response);
      if (response.StatusCode == 'SUCCESS') {
        this.claimObject = response.Data;

        this.uploaderDefectiveDetail = [];
        if (this.claimObject.ClaimAttachments && this.claimObject.ClaimAttachments.length) {
          for (let i = 0; i < this.claimObject.ClaimAttachments.length; i++) {
            this.uploaderDefectiveDetail.push({ 'name': this.claimObject.ClaimAttachments[i].FileName, 'path': this.claimObject.ClaimAttachments[i].FilePath, 'AttachmentID': this.claimObject.ClaimAttachments[i].AttachmentID })
          }
        }

        this.palletTicketFileUploadDetail = [];
        if (this.claimObject.PalletTicketAttachments && this.claimObject.PalletTicketAttachments.length) {
            for (let i = 0; i < this.claimObject.PalletTicketAttachments.length; i++) {
              this.palletTicketFileUploadDetail.push({ 'name': this.claimObject.PalletTicketAttachments[i].FileName, 'path': this.claimObject.PalletTicketAttachments[i].FilePath, 'AttachmentID': this.claimObject.PalletTicketAttachments[i].AttachmentID })
            }
        }

        this.masterCartonBarcodeFileUploadDetail = [];
        if (this.claimObject.MasterCartonBarcodeAttachments && this.claimObject.MasterCartonBarcodeAttachments.length) {
            for (let i = 0; i < this.claimObject.MasterCartonBarcodeAttachments.length; i++) {
              this.masterCartonBarcodeFileUploadDetail.push({ 'name': this.claimObject.MasterCartonBarcodeAttachments[i].FileName, 'path': this.claimObject.MasterCartonBarcodeAttachments[i].FilePath, 'AttachmentID': this.claimObject.MasterCartonBarcodeAttachments[i].AttachmentID })
            }
        }

        this.claimObject.CreatedBy = JSON.parse(localStorage.getItem("Weightage")).UserId;
        this.claimObject.ActionRequested.Responsible = 1;
        this.populateCountry(this.claimObject.ClaimDetails.SBUId);
        this.majorMinorClaim = 'minor';
        if(this.claimObject.ClaimDetails.IsMajorClaim) {
          this.majorMinorClaim = 'major';
        }
      }
      this.common.hideLoader();
    }, error => {
      this.common.hideLoader();
    });
  }

  invoiceSearchClick(_invoiceNumber):void{
    this.invoiceDetails = {};
    if(!_invoiceNumber) {
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
    }
    this.common.http.doPost(this.common.url.getInvoiceSearch(), inputData, response => {
      this.common.hideLoader();
      if (response.ResponseCode === 200 && response.Data) {
        this.invoiceDetails = response.Data;
        let invoiceModal = this.modalCtrl.create(InvoiceModalPage, {invoiceDetails: this.invoiceDetails});
        invoiceModal.present();

        invoiceModal.onDidDismiss(selectedInvoice => {
          if(this.invoiceDetails.ES_HEADER && selectedInvoice) {
            this.claimObject.ClaimDetails.InvoiceCurrency = this.invoiceDetails.ES_HEADER.CURRENCY;
            this.claimObject.ClaimDetails.InvoiceValue = this.invoiceDetails.ES_HEADER.AMOUNT;
            this.claimObject.CustomerDetails.CustomerNumber = this.invoiceDetails.ES_HEADER.CUSTOMER;
            this.claimObject.CustomerDetails.CustomerPhone = this.invoiceDetails.ES_HEADER.TEL_NUMBER;
            this.claimObject.CustomerDetails.CustomerName = this.invoiceDetails.ES_HEADER.NAME;
          }
          if(selectedInvoice) {
            this.claimObject.ProductDetails.DeliveryNumber = selectedInvoice.DELIVERY;
            this.claimObject.ProductDetails.SKUNumber = selectedInvoice.KDMAT;
            this.claimObject.ProductDetails.InternalSKU = selectedInvoice.MATNR;
            selectedInvoice.LGMNG = (selectedInvoice.LGMNG)?selectedInvoice.LGMNG.split('.')[0]:'';
            this.claimObject.ProductDetails.NoOfDeliveredItems = selectedInvoice.LGMNG;
          }

        });
      } else if (response.ResponseCode === 400) {
        this.common.showToast('SAP Login Failed.');
      } else if (response.ResponseCode === 600) {
        this.common.showToast('Unknown error occured.');
      } else {
        this.common.showToast(response.ResponseMessage);
      }
    }, error => {
        this.common.hideLoader();
        this.common.showToast('Unknown error occured.');
    });
  }

  validateAndSubmitClaim(_claim, _action) {
    if(!this.validateBasicDetails(_claim)) {
      this.gotoSlide(0);
      return false;
    }
    
    if(!this.validateCustomerDetails(_claim)) {
      this.gotoSlide(1);
      return false;
    }
    
    if(!this.validateProductDetails(_claim)) {
      this.gotoSlide(2);
      return false;
    }
    
    if(!this.validateClaimDetails(_claim)) {
      this.gotoSlide(3);
      return false;
    }
    if(_claim.ClaimDetails.sendEmailsTo && !this.isValidEmailIds(_claim.ClaimDetails.sendEmailsTo)) {
      this.common.showToast('Please enter valid email Ids.');
      return false;
    }
    this.draftOrSubmitClaim(_claim, _action);
  }

  draftOrSubmitClaim(_claim, _action) {
    _claim.ClaimAction = _action;
    if(_claim.CustomerDetails.Country) delete _claim.CustomerDetails.Country;
    this.common.showLoader();
    let postUrl = this.common.url.getCreateNewClaimURL();
    if(_claim.ComplaintNumber) {
      postUrl = this.common.url.getEditClaimURL();
    }
    this.common.http.doPost(postUrl, _claim, response => {
      console.log(response);
      if (response.StatusCode === 'SUCCESS') {
        if (response.Message) {
          if(_claim.ComplaintNumber) {
            this.common.showToast('Claim ' +_claim.ComplaintNumber+ ' updated successfully.', 'success');
          } else {
            _claim.ComplaintNumber = response.Data.ComplaintNumber;
            this.common.showToast('Claim ' + _claim.ComplaintNumber + ' submitted successfully.', 'success');
          }
          this.claimId = response.Data.ClaimId;
          this.claimStatus = response.Data.claimStatusId;
          this.uploadAllImages(this.claimId, _action);
        }
      } else {
        this.common.showToast('Error in creating Claim');
        this.common.hideLoader();
      }
    }, error => {

    });

  }

  /*Validate each sections*/
  public emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");

  validateBasicDetails(_claim) {
    this.isSubmitted = true;
    if(_claim.InitiatorDetails.InitiatorPhone && !this.isValidNumber(_claim.InitiatorDetails.InitiatorPhone)) {
      this.errorFields.InitiatorPhone = true;
      this.common.showToast('Initiator Phone should be a number value.');
      return false;
    }
    if(_claim.InitiatorDetails.Extension && !this.isValidNumber(_claim.InitiatorDetails.Extension)) {
      this.common.showToast('Initiator Phone Extension should be a number value.');
      return false;
    }
    if(_claim.ClaimDetails.PONumber && !this.isValidNumbercomma(_claim.ClaimDetails.PONumber)) {
      this.common.showToast('PO Number should be a number value.');
      return false;
    }
    if(_claim.ClaimDetails.InvoiceNumber && !this.isValidNumbercomma(_claim.ClaimDetails.InvoiceNumber)) {
      this.common.showToast('Invoice No. should be a number value.');
      return false;
    }
    if(_claim.ClaimDetails.SBUId == '0') {
      this.common.showToast('Please select Sales Business Unit');
      return false;
    }
    if(_claim.ProductDetails.ComplaintCategoryID == '0') {
      this.common.showToast('Please select Complaint Category');
      return false;
    }
    if(_claim.CustomerDetails.ModeOfComplaintID == '0') {
      this.common.showToast('Please select Mode of Complaint');
      return false;
    }
    return true;
  }


  validateCustomerDetails(_claim) {
    this.isSubmitted = true;
    if(!_claim.CustomerDetails.CustomerName) {
      this.common.showToast('Please enter customer name');
      return false;
    }
    if(!_claim.CustomerDetails.CustomerNumber) {
      this.common.showToast('Please enter customer number');
      return false;
    }
    if(_claim.CustomerDetails.CustomerNumber.length > 10) {
      this.common.showToast('Customer No. should be less than or equal to 10 characters.');
      return false;
    }
    if(_claim.CustomerDetails.CustomerPhone && !this.isValidNumber(_claim.CustomerDetails.CustomerPhone)) {
      this.common.showToast('Customer Phone should be a number value.');
      return false;
    }
    if(_claim.CustomerDetails.Extn && !this.isValidNumber(_claim.CustomerDetails.Extn)) {
      this.common.showToast('Customer Phone Extension should be a number value.');
      return false;
    }
    if(_claim.CustomerDetails.DistributionChannelID == '0') {
      this.common.showToast('Please select distribution channel');
      return false;
    }
    if(!_claim.CustomerDetails.ContactPerson) {
      this.common.showToast('Please enter contact person name');
      return false;
    }
    if(_claim.CustomerDetails.Email && !this.emailPattern.test(_claim.CustomerDetails.Email)) {
      this.common.showToast("Please enter customer's valid email");
      return false;
    }
    return true;
  }

  validateProductDetails(_claim) {
    this.isSubmitted = true;
    if(_claim.ProductDetails.BrandID == '0') {
      this.common.showToast('Please select Brand');
      return false;
    }
    /*if(!_claim.ProductDetails.SKUNumber || (_claim.ProductDetails.SKUNumber && (_claim.ProductDetails.SKUNumber.length>10 || !this.isAlphaNumeric(_claim.ProductDetails.SKUNumber)))) {
      this.common.showToast('SKU No. should be a alphanumeric value with less than 10 characters.');
      return false;
    }*/
    if(!_claim.ProductDetails.InternalSKU || (_claim.ProductDetails.InternalSKU && (_claim.ProductDetails.InternalSKU.length>10 || !this.isAlphaNumeric(_claim.ProductDetails.InternalSKU)))) {
      this.common.showToast('Internal SKU No. should be a alphanumeric value with less than 10 characters.');
      return false;
    }
    if(!_claim.ProductDetails.ProductDescription) {
      this.common.showToast('Please enter valid product description.');
      return false;
    }
    if(_claim.ProductDetails.DeliveryNumber && !this.isValidNumber(_claim.ProductDetails.DeliveryNumber)) {
      this.common.showToast('Delivery No. should be a number value.');
      return false;
    }
    if(_claim.ProductDetails.NoOfDeliveredItems === '') {
      this.common.showToast('Please enter delivered items.');
      return false;
    }
    if(_claim.ProductDetails.NoOfDeliveredItems && !this.isValidNumber(_claim.ProductDetails.NoOfDeliveredItems)) {
      this.common.showToast('No.of delivered item should be a number value.');
      return false;
    }

    if(_claim.ProductDetails.NoOfDefectedItems === '') {
      this.common.showToast('Please enter defective items.');
      return false;
    }
    if(_claim.ProductDetails.NoOfDefectedItems && !this.isValidNumber(_claim.ProductDetails.NoOfDefectedItems)) {
      this.common.showToast('No.of defective item should be a number value.');
      return false;
    }
    if(parseInt(_claim.ProductDetails.NoOfDefectedItems) > parseInt(_claim.ProductDetails.NoOfDeliveredItems)) {
      this.common.showToast('No. of defective items should be less than No. of delivered items.');
      return false;
    }
    if(moment(_claim.ClaimDetails.CreatedDate).diff(moment(_claim.ProductDetails.DeliveryDate), 'days') < 0) {
      this.common.showToast('Delivery date should be before the Create Date.');
      return false;
    }
    if (this.uploaderPalletTicket.queue.length + this.cameraUploaderPalletTicket.length > 10) {
      this.common.showToast('Maximum 10 files can be attached for Pallet Ticket.');
      return false;
    }
    return true;
  }

  validateClaimDetails(_claim) {
    this.isSubmitted = true;
    if(!_claim.ActionRequested.ComplaintDesc) {
      this.common.showToast('Please enter complaint description.');
      return false;
    }

    if(moment(_claim.ClaimDetails.CreatedDate).diff(moment(_claim.ActionRequested.ExpDateRcvSamples), 'days') > 0) {
      this.common.showToast('Expected sample receive date should be after the Create Date.');
      return false;
    }

    if (this.uploaderdefectiveSampleAttach.queue.length + this.cameraUploaderDefectiveTicket.length > 10) {
      this.common.showToast('Maximum 10 files can be attached for Pictures of Defective Sample Received.');
      return false;
    }

    if(_claim.ActionRequested.RANumber && !this.isAlphaNumeric(_claim.ActionRequested.RANumber)) {
      this.common.showToast('Return Authorization should be a alphanumeric value with less than 10 characters.');
      return false;
    }

    if(_claim.ActionRequested.ICQuantity && !this.isValidNumber(_claim.ActionRequested.ICQuantity)) {
      this.common.showToast('Issue credit-Quantity should be a number value.');
      return false;
    }

    if(parseInt(_claim.ActionRequested.ICQuantity) > parseInt(_claim.ProductDetails.NoOfDefectedItems)) {
      this.common.showToast('Issue Credit Quantity should be less than No.of defective items.');
      return false;
    }

    if(_claim.ActionRequested.ICUnitCost && !this.unitCostValidation(_claim.ActionRequested.ICUnitCost)) {
      this.common.showToast('Unit cost is invalid.');
      return false;
    }

    if(_claim.ActionRequested.IssueCreditAdditionalCost && !this.unitCostValidation(_claim.ActionRequested.IssueCreditAdditionalCost)) {
      this.common.showToast('Additional cost is invalid.');
      return false;
    }

    if(_claim.ActionRequested.ReplacementQuantity && !this.isValidNumber(_claim.ActionRequested.ReplacementQuantity)) {
      this.common.showToast('Replacement-Quantity should be a number value.');
      return false;
    }

    if(parseInt(_claim.ActionRequested.ReplacementQuantity) > parseInt(_claim.ProductDetails.NoOfDefectedItems)) {
      this.common.showToast('No. of Replacement Quantity should be less than No.of defective items.');
      return false;
    }

    if(_claim.ActionRequested.ReplacementUnitCost && !this.unitCostValidation(_claim.ActionRequested.ReplacementUnitCost)) {
      this.common.showToast('Unit cost is invalid.');
      return false;
    }

    let Threshold = parseInt(this.currencyObject.Threshold);
    
    if (_claim.ActionRequested.IsCommertialAction == true && _claim.ClaimDetails.IsMajorClaim == false) {
      if (Number(_claim.ActionRequested.ICTotalCost) > Threshold) {
        this.common.showToast('Total cost should not exceed ' + this.currencyObject.CurrencySymbol + Threshold + ' for minor claims.');
        return false;
      }
    }    

    return true;
  }
  /*Validations*/

  /* Regex validation for phone,email,number,alphanumeric*/
  //utility function for Invoice and PO number format 
  invoiceFormaterUtility(mValue:string){
    let filteredArray:any = [];
    let rawArray:any = [];
    rawArray = mValue.split(',')
    for (var inx in rawArray) {
      let temp:string = rawArray[inx];
      if(temp!='0' && temp.length <= 10 && temp.length >= 1){
        filteredArray.push(temp)
      }else if(temp.length > 10){
        temp = temp.trim();
        temp = temp.substring(0, 10);
        filteredArray.push(temp)
      }else{}
    }
    return filteredArray;
  }
  // Invoice and PO number format End

  noCommercialClicked(_actionRequested) {
    _actionRequested.IsCommertialAction = false;
    this.resetMajorMinorFilters(this.claimObject);
  }

  commercialClicked(_actionRequested) {
    _actionRequested.IsCommertialAction = true;
    this.resetMajorMinorFilters(this.claimObject);
  }

  defectiveSampleClicked(_actionRequested) {
    if(_actionRequested.IsDefSamplesReceived) {
      _actionRequested.ExpDateRcvSamples = '';
    }
  }

  minorOptionClick(_claimDetails) {
    if(this.majorMinorClaim == 'major') {
      this.resetMajorMinorFilters(this.claimObject);
    }
    _claimDetails.IsMajorClaim = false;
    this.majorMinorClaim = 'minor';
  }

  majorOptionClick(_claimDetails) {
    if(this.majorMinorClaim == 'minor') {
      this.resetMajorMinorFilters(this.claimObject);
    }
    _claimDetails.IsMajorClaim = true;
    this.majorMinorClaim = 'major';
  }

  resetMajorMinorFilters(_claim) {
    _claim.ActionRequested.IsIssueCredit = false;
    _claim.ActionRequested.CAPAFlag = false;
    _claim.ActionRequested.IsReplacement = false;
    _claim.ActionRequested.IsRemarks = false;
    _claim.ActionRequested.IsRA = false;
    _claim.ActionRequested.Remarks = '';
    this.resetIssueCreditReplacement(_claim.ActionRequested);
  }

  issueCreditClick(_actionRequested) {
    if(_actionRequested.IsIssueCredit) {
      _actionRequested.IsReplacement = false;
    }
    this.resetIssueCreditReplacement(_actionRequested);
  }

  replacementClick(_actionRequested) {
    if(_actionRequested.IsReplacement) {
      _actionRequested.IsIssueCredit = false;
    }
    this.resetIssueCreditReplacement(_actionRequested);
  }

  resetIssueCreditReplacement(_actionRequested) {
    _actionRequested.ICTotalCost = '';
    _actionRequested.ICUnitCost = '';
    _actionRequested.ICQuantity = '';
    _actionRequested.IssueCreditAdditionalCost = '';
    _actionRequested.ReplacementUnitCost = '';
    _actionRequested.ReplacementQuantity = '';
    _actionRequested.ReplacementTotalCost = '';
  }

  issueCreditTotalCost(_actionRequested): void {
    _actionRequested.ICTotalCost = ((_actionRequested.ICUnitCost * _actionRequested.ICQuantity) + Number(_actionRequested.IssueCreditAdditionalCost)).toFixed(4);
  }

  issueReplacementTotalCost(_actionRequested): void {
    _actionRequested.ReplacementTotalCost = (_actionRequested.ReplacementUnitCost * _actionRequested.ReplacementQuantity).toFixed(4);
  }

  invFormatValidate(_obj) {
    _obj.InvoiceNumber = this.invoiceFormaterUtility(_obj.InvoiceNumber).join(",");
    _obj.PONumber = this.invoiceFormaterUtility(_obj.PONumber).join(",");
  }
  phoneNumberValidation(number): boolean {
    if (number) {
      var regex = /^((\+\d{1,2}|1)[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      return regex.test(number);
    }
  }
  isValidEmail(email): boolean {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }
  isValidNumber(number): boolean {
    var regex = /^[0-9]{1,12}$/;
    return regex.test(number);
  }
  isValidNumbercomma(number): boolean {
    var regex = /^[0-9, ]+$/;
    return regex.test(number);
  }
  isAlphaNumeric(text): boolean {
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(text);
  }
  unitCostValidation(price): boolean {
    var regex = /^(?:\d*\.\d{1,4}|\d+)$/;
    return regex.test(price);
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

  validateDefectiveItems(_deliveredItems, _defectiveItems): boolean {
    if(_defectiveItems == '' || _defectiveItems == '0' || _defectiveItems == 0) return false;
    if(parseInt(_defectiveItems) > parseInt(_deliveredItems))
      return true;
    else
      return false;
  }

  populateCountry(_SBUId) {
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
  }

  distributionChannelList(_SBUId) {
    this.common.http.doGet(this.common.url.getDistributionChannelListURL(_SBUId), response => {
      if (response.StatusCode === 'SUCCESS') {
        this.dropDownData.DistributionChannelList = response.Data ? response.Data : [];      
      }
    }, error => {
    });
  }

  editClaimClicked() {
    this.isViewMode = false;
    this.isEditMode = true;
  }

  resetClicked() {
    let alert = this.alertCtrl.create({
      message: 'Reset will clear all values entered before saving. Do you want to Continue?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if(this.claimObject.ComplaintNumber) {
              this.getClaimDetails(this.claimObject.ComplaintNumber);
            } else {
              this.initilizeClaimObject();
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentPopover(_data) {
    let popover = this.popoverCtrl.create(TooltipPage, {data: _data}, {cssClass: 'my-custom-tooltip'});
    popover.present();
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
      if(!this.validateCustomerDetails(_claim)) {
        return false;
      } 
    }
    
    if(this.stepNavigation == 2) {
      if(!this.validateProductDetails(_claim)) {
          return false;
      } 
    }
    
    if(this.stepNavigation == 3) {
      if(!this.validateClaimDetails(_claim)) {
          return false;
      } 
    }
    this.isSubmitted = false;
    this.stepNavigation = (parseInt(this.stepNavigation) + 1).toString();
    this.stepsCompleted = (this.stepsCompleted < 5) ? (this.stepsCompleted + 1) : 5;
  } 


  gotoBackPage() {
    this.navCtrl.pop();
  }
  /*End Slider related function*/

  initilizeClaimObject() {
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
        'ICResponsibleDepartmentId': 1,
        'ReplacementResponsibleDepartmentId': 1,
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
        'SBUId': '0',
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
  }

}
