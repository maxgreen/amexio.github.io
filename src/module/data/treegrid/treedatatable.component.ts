/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author - Ketan Gote, Pratik Kelwalkar, Dattaram Gawas
 *
 */

import {
  OnInit, Input, Component, QueryList, ContentChildren
} from '@angular/core';
import {CommonDataService} from "../../services/data/common.data.service";
import {AmexioGridColumnComponent} from "../datagrid/data.grid.column";

@Component({
  selector : 'amexio-tree-data-table',
  template : `

    <div class="datatable">
      <div class="datatable-header">
        <ng-container *ngFor="let cols of columns;let i = index">
          <div class="datatable-col" [ngClass]="{'header' : i == 0}"> {{cols.text}}</div>
        </ng-container>
      </div>
    </div>

    <div class="datatable">
      <div class="datatable-row" *ngFor="let row of viewRows;let i=index">

        <div class="datatable-col" *ngFor="let cols of columns;let colIndex = index">
          <ng-container *ngIf="colIndex == 0">
              <span [ngStyle]="{'padding-left':(20*row.level)+'px'}">
                    <i *ngIf="!row.expanded && row.children" class="fa fa-plus" aria-hidden="true" (click)="toogle(row,i)"></i>
                    <i *ngIf="row.expanded && row.children" class="fa fa-minus" aria-hidden="true" (click)="toogle(row,i)"></i>
                     {{row[cols.dataIndex]}}
               </span>
          </ng-container>

          <ng-container *ngIf="colIndex > 0" >
            {{row[cols.dataIndex]}}
          </ng-container>
        </div>
      </div>
    </div>

  `,

})

export class TreeDataTableComponent implements  OnInit{

  @Input()    data : any;

  @Input()    dataReader : string;

  @Input()    httpMethod : string;

  @Input()    httpUrl : string;

  @Input()    displayField : string;

  @Input()    valueField : string;

  responseData : any;

  columns: any[] = [];

  previousValue : any;

  viewRows : any;

  @ContentChildren(AmexioGridColumnComponent) columnRef: QueryList<AmexioGridColumnComponent>;

  constructor(public treeDataTableService : CommonDataService){

  }

  ngOnInit(){

    if (this.httpMethod && this.httpUrl){

      this.treeDataTableService.fetchData(this.httpUrl, this.httpMethod).subscribe(
        response => {
          this.responseData = response.json();
        },
        error => {
        },
        () => {
          this.setData(this.responseData);
        }
      );
    } else if (this.data) {
      this.previousValue = JSON.parse(JSON.stringify(this.data));
      this.setData(this.data);
    }
  }

  ngAfterContentInit() {
    this.createConfig();
  }

  createConfig() {
    let columnRefArray = [];
    columnRefArray = this.columnRef.toArray();
    for (let cr = 0 ; cr < columnRefArray.length; cr++) {
      const columnConfig = columnRefArray[cr];
      let columnData: any;
      if (columnConfig.bodyTemplate == null && columnConfig.headerTemplate == null) {
        columnData = {
          text: columnConfig.text, dataIndex: columnConfig.dataIndex,
          hidden: columnConfig.hidden, dataType : columnConfig.dataType
        };
      }

      this.columns.push(columnData);
    }
  }

  setData(httpResponse: any){
    let treedata = this.getResponseData(httpResponse);
    this.viewRows = treedata;
    this.viewRows.forEach((row : any,index : any)=>{
      this.viewRows[index].level=1;
      this.viewRows[index].expand=false;
    });
  }

  getResponseData(httpResponse : any){
    let responsedata = httpResponse;
    if(this.dataReader != null){
      let dr = this.dataReader.split('.');
      for (let ir = 0 ; ir < dr.length; ir++){
        responsedata = responsedata[dr[ir]];
      }
    }
    else{
      responsedata = httpResponse;
    }

    return responsedata;
  }

  toogle(row:any,index:number) {
    row.expanded=!row.expanded;
    if(row.expanded){
      this.addRows(row,index);
    }else{
      this.removeRows(row);
    }
  }

  addRows(row : any,index:number){
    for(let i=0;i<row.children.length;i++){
      let node = row.children[i];
      if(!row.level){
        row.level=1;
      }
      if(node.children) {
        node.expanded = false;
      }
      node.level = (row.level+1);
      this.viewRows.splice(index+(i+1),0,node);
    }
  }

  removeRows(node : any){
    for(let i=0;i<node.children.length;i++){

      for(let j=0; j<this.viewRows.length; j++){

        if(this.viewRows[j] === node.children[i]){
          if(node.children[i].children)
            this.removeRows(node.children[i]);

          this.viewRows.splice(this.viewRows.indexOf(node.children[i]), 1);

        }
      }
    }
  }

}
