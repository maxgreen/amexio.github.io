import { Component,ContentChild, OnInit,QueryList,AfterContentInit,AfterViewInit, EventEmitter, Directive, Input, ViewChild, ElementRef, Output, ContentChildren, ViewChildren } from '@angular/core';
import {CommonDataService} from "../../services/data/common.data.service";
import  { AmexioSearchAdvanceComponent } from '../advancesearch/searchadvance.component';
 

@Component({
  selector: 'app-searchboxtool',
  templateUrl: './searchboxtool.component.html',
  
})
export class SearchboxtoolComponent implements OnInit , AfterContentInit {
  
/*
Properties
name : data
datatype : any
version : 4.2 onwards
default : none 
description : Local data for dropdown.
*/
@Input() data: any;
/*
Properties
name : data-reader
datatype : string
version : 4.2 onwards
default : none
description : Key in JSON datasource for records
*/
@Input('data-reader') datareader: any;
/*
Properties
name : http-url
datatype : string
version : 4.2 onwards
default : none
description : REST url for fetching datasource.
*/
@Input('http-url') httpurl: string;
/*
Properties
name : place-holder
datatype : string
version : 4.2 onwards
default : none
description : Show place-holder inside dropdown component
*/
@Input('place-holder') placeholder: string;
/*
Properties
name : display-field
datatype : string
version : 4.2 onwards
default : none
description : Sets key inside response data to display.
*/
@Input('display-field') displayfield: string;
/*
Properties
name : http-method
datatype : string
version : 4.2 onwards
default : none
description : Type of HTTP call, POST,GET.
*/
@Input('http-method') httpmethod: string;
/*
Properties
name : title
datatype : string
version : 4.2 onwards
default : none
description : sets title to advance search form
*/
@Input() title: string="Advance Search";
/*
Properties
name : value-field
datatype : string
version : 4.2 onwards
default : none
description : Name of key inside response data.use to send to backend
*/
@Input('value-field') valuefield: string;
/*
Properties
name : width
datatype : number
version : 4.2 onwards
default : none
description : Sets width to auto recommendation list.
*/
@Input() width: number;
/*
Events 
name : keyup
description : Fires when keyup event occurs
*/
@Output() keyup: any = new EventEmitter<any>();
 
@Output() onSearchItemClick: any = new EventEmitter<any>();

@Output() onSearchClick: any = new EventEmitter<any>();
@ContentChild(AmexioSearchAdvanceComponent) advanceSearchRef:AmexioSearchAdvanceComponent;
@ViewChild('dropdownitems', { read: ElementRef }) public dropdownitems: ElementRef;
@ViewChild('inp', { read: ElementRef }) public inp: ElementRef;  
   
  value:string;
  responseData: any;
  viewData: any;
  textValue: any;
  localData: any;
  caretFlag: boolean = false;
  searchFlag: boolean = false;
  searchTextBox: boolean = false;

  displayValue: any;
  isComponentValid: boolean;
  selectedValue: any;
  advanceSearchFlag: boolean = false;

  labelValue: string;

  selectedindex: number = 0;
  scrollposition: number = 30;
  enableAdvanceSearch:boolean =  false;
  advanceButtonLabel:string;
 // length:number=this.selectedValue.length;

 enableAdvnSearch: boolean;

  
  constructor(private dataService: CommonDataService) {
  
  }
 

  ngAfterContentInit(){
    this.enableAdvnSearch = this.advanceSearchRef.advanceSearchFlag;
  this.enableAdvanceSearch=true;
   if(this.advanceSearchRef){
       this.enableAdvanceSearch=true;
    if(this.advanceSearchRef.title){
       
      this.advanceButtonLabel=this.advanceSearchRef.title;
      }else if (!this.advanceSearchRef.title || this.advanceSearchRef.title==''){
        this.advanceButtonLabel='Advance Search';
      }
     }
 }
  //service to get info from json
  // getinfo() {
  //   let jsonData: any;

  //   this.http.get('assets/data/info.json')
  //     .subscribe((response: any) => {
  //       jsonData = response.data;
  //     },
  //       (err) => { },
  //       () => {
  //         this.viewData = jsonData;
  //         this.localData = jsonData;
  //       });
  // }



  ngOnInit() {
    
    if (this.httpmethod && this.httpurl) {
      this.dataService.fetchData(this.httpurl,this.httpmethod).subscribe(response => {
        
        this.responseData = response;
        
      }, error => {
      }, () => {
        this.setData(this.responseData);
        
      });

    } else if (this.data) {

      // this.previousData = JSON.parse(JSON.stringify(this.data));
      this.setData(this.data);
     }
 
  }
  


  onSelectClick() {
    //this.searchFlag=true;
    this.advanceSearchFlag = false;
  }
  onInputClick(event: any) {
     // if(this.inp.nativeElement.length > 0)
    this.searchFlag = true;
    let keyword: any = event.target.value;
    this.viewData = [];
    if (keyword != null && keyword != ' ') {
      let search_term = keyword.toLowerCase();
      this.localData.forEach((item: any) => {
        if (item != null) {
         
          //if word exist in start
          if (item[this.displayfield].toLowerCase().startsWith(search_term)) {

            this.viewData.push(item);
          }
          
          // if ( item[this.displayfield].toLowerCase().indexOf(' ' + search_term) >= 0) {
          //   this.viewData.forEach(element => {
          //     if(item[this.displayfield].toLowerCase==element)
          //     {

          //     }
          //     else{
          //       this.viewData.push(item);

          //     }
          //   });
          //  }


        }
      });
     
      this.keyup.emit(event);

     }

    //logic for arrow keys and enter key press
    //40=down-arrow and 38=up-arrow and 13=enter
    if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13) {
      //if key pressed is up down or enter then process accordingly
      //call function for process
      this.navigateKeys(event);
    }

    //this.searchFlag=false;

    if(!this.selectedValue || this.selectedValue==''){
      this.viewData=[];
    }

  }




  navigateKeys(event: any) {


    //first if
    if (this.selectedindex > this.viewData.length) {
      this.selectedindex = 0;
    }
 

    if (event.keyCode === 40 ||
      event.keyCode === 38
      && this.selectedindex < this.viewData.length) {
 
      let prevselectedindex = 0;
      if (this.selectedindex === 0) {
        this.selectedindex = 1;
 
      } else {
        prevselectedindex = this.selectedindex;
        if (event.keyCode === 40) {
          this.selectedindex++;
 
          if ((this.selectedindex > 5)) {
 
            this.dropdownitems.nativeElement.scroll(0, this.scrollposition);
            this.scrollposition = this.scrollposition + 30;
 
          }
        }
        else if (event.keyCode === 38) {
 
          this.selectedindex--;
 
          if (this.scrollposition >= 0 && this.selectedindex > 1) {
            this.dropdownitems.nativeElement.scroll(1, this.scrollposition);
            this.scrollposition = this.scrollposition - 30;
 

          }
          if (this.selectedindex === 1) {
            this.scrollposition = 30;
 

          }

          if (this.selectedindex <= 0) {
 
            //this.selectedindex = 1;
          }
        }
      }

      if (this.viewData[this.selectedindex]) {
        this.viewData[this.selectedindex].selected = true;
 
      }
      if (this.viewData[prevselectedindex]) {
        this.viewData[prevselectedindex].selected = false;
 
      }
    }



    if (event.keyCode === 13 && this.viewData[this.selectedindex]) {
      this.onItemSelect(this.viewData[this.selectedindex]);
 
    }

  }

  onSearchButtonClick(event:any){
this.onSearchClick.emit(event);
  }
  selectCssClass(): string {

    if (this.viewData.length > 5) {
      return "dropdown-list scroll";
    }
    else {
      return "dropdown-list";
    }
  }

  onItemSelect(item: any) {
    this.value= item[this.valuefield];;
     this.selectedValue = item[this.displayfield];
    this.searchFlag = false;
    this.onSearchItemClick.emit(item);
  }

  advanceSearch() {
    this.advanceSearchRef.advanceSearchFlag = true;
    this.advanceSearchFlag = true;
    this.searchFlag = false;
    
//  this.childComponent.advanceSearchFlag=true;
  }

  closeSearchForm() {
    this.advanceSearchFlag = false;
  }


  getResponseData(httpResponse: any) {
    let responsedata = httpResponse;
 
    if (this.datareader != null) {
      let dr = this.datareader.split(".");
      if (dr != null) {
        for (let ir = 0; ir < dr.length; ir++) {
          responsedata = responsedata[dr[ir]];
        }
      }
    } else {
      responsedata = httpResponse;
    }
     

    return responsedata;
  }


 

  setData(httpResponse: any) {
     let responsedata = httpResponse;
        //Check if key is added?
    if (this.datareader != null) {
       let dr = this.datareader.split(".");
       for (let ir = 0; ir < dr.length; ir++) {
        responsedata = responsedata[dr[ir]];
       }
    } else {
      responsedata = httpResponse;
    }

    this.viewData = responsedata;
    this.localData = JSON.parse(JSON.stringify(this.viewData));
   }

 
}