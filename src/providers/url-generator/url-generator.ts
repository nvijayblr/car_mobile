import { Injectable } from '@angular/core';
import { Constant } from '../constant/constant'


@Injectable()
export class UrlGeneratorProvider {

  constructor(public constant:Constant) {
  }

  getLanguageList() {
    return this.constant.baseURL + 'api/home/Languages';
  }
  getDomainListUrl() {
    return this.constant.baseURL + 'api/GetAllDomains';
  }

	getLoginUserURL() {
		return this.constant.baseURL + 'api/login';
	}

  getWeightageListURL() {
    return this.constant.baseURL + 'api/UserModuleTransactions'
  }

  getSearchClaimURL() {
    return this.constant.baseURL + 'api/external/searchClaim';
  }

  getClaimCategoryURL() {
    return this.constant.baseURL + 'api/external/ClaimCategory';
  }

  getClaimStatusURL() {
    return this.constant.baseURL + 'api/external/ClaimStatus';
  }

  getClaimTypesURL() {
    return this.constant.baseURL + 'api/external/ClaimTypes';
  }

  getSBUListURL() {
    return this.constant.baseURL + 'api/external/SBUList';
  }

  getComplaintCategoryListURL() {
    return this.constant.baseURL + 'api/external/ComplaintCategory';
  }

  getModeOfComplaintListURL() {
    return this.constant.baseURL + 'api/external/ModeOfComplaintList';
  }

  getCountryURL() {
    return this.constant.baseURL + 'api/external/Country';
  }

  getDistributionChannelListURL(_SBUId) {
    return this.constant.baseURL + 'api/external/DistributionChannelList/'+_SBUId;
  }

  getBrandListURL() {
    return this.constant.baseURL + 'api/external/BrandList';
  }

  getAllDropDownDataURL() {
    return this.constant.baseURL + 'api/lookup';
  }

  getClaimDetailsURL(_complaintNo) {
    return this.constant.baseURL + 'api/external/ClaimDetails?CompliantNumber=' + _complaintNo;
  }

  getInvoiceSearch() {
    return this.constant.baseURL + 'api/invoice/searchInvoice';
  }

/*  getDistributionChannelList(_SBUId) {
      return this.constant.baseURL + 'api/lookup/DistributionChannel/' + _SBUId;
  }
*/
  getCreateNewClaimURL() {
      return this.constant.baseURL + 'api/external/CreateClaim';
  }
  
  getEditClaimURL() {
      return this.constant.baseURL + 'api/external/EditClaim';
  }
  
  getFileUploadURL(_claimId, _key) {
      return this.constant.baseURL + 'api/external/FileUpload?claimId=' + _claimId + '&key='+_key;
  }

  getDeleteAttachmentURL() {
      return this.constant.baseURL + 'api/external/DeleteFile';
  }

  /*Internal Modules*/
  getInternalSearchClaimURL() {
    return this.constant.baseURL + 'api/internal/searchClaim ';
  }
  getInternalClaimType() {
    return this.constant.baseURL + 'api/internal/GetClaimTypes ';
  }
  getInternalClaimStatus() {
    return this.constant.baseURL + 'api/internal/InternalClaimStatus ';
  }

  getEmployementType() {
    return this.constant.baseURL + 'api/internal/EmployementType ';
  }

  getInjuryLocation() {
    return this.constant.baseURL + 'api/internal/InjuryLocation ';
  }

  getInjuryNature() {
    return this.constant.baseURL + 'api/internal/InjuryNature ';
  }

  getSendTo() {
    return this.constant.baseURL + 'api/internal/SendTo';
  }

  getAccidentClaim(_referenceNo) {
    return this.constant.baseURL + 'api/internal/GetClaim?ReferenceNo='+_referenceNo;
  }

  createAccidentClaim() {
    return this.constant.baseURL + 'api/internal/createAccidentDeclaration';
  }

  updateAccidentClaim() {
    return this.constant.baseURL + 'api/internal/editAccidentDeclaration';
  }

  uploadAccidentImages(_referenceNo) {
    return this.constant.baseURL + 'api/internal/UploadAccidentFile?ReferenceNo='+_referenceNo;
  }

  deleteAccidentAttachment() {
    return this.constant.baseURL +'api/internal/DeleteAccidentFile';
  }

  getHazardNature(){
    return this.constant.baseURL + 'api/internal/GetHazardNature';
  }

  getEstimatedPriority(){
    return this.constant.baseURL + 'api/internal/GetEstimatedPriority';
  }

  getHazardClaim(_referenceNo) {
    return this.constant.baseURL + 'api/internal/HazardIdentification/'+_referenceNo;
  }
  updateHazardClaim() {
    return this.constant.baseURL + 'api/internal/EditHazardIdentification';
  }

  createHazardClaim() {
    return this.constant.baseURL + 'api/internal/CreateHazardIdentification';
  }

  uploadHazardImages(_referenceNo) {
    return this.constant.baseURL +'api/internal/UploadHazardFile?ReferenceNo='+_referenceNo;
  }
  getrefreshTokenURL() {
		return this.constant.baseURL + 'api/refreshtoken';
	}
  
}
