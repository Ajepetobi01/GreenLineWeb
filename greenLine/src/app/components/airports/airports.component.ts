import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styles: [],
})
export class AirportsComponent implements OnInit {
  AirportForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = false;
  airports: any[] = [];
  actualData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private nzNotify: NzMessageService
  ) {}

  ngOnInit(): void {
    this.AirportForm = this.fb.group({
      code: [null],
      file: [null, [Validators.required]],
    });
    this.LoadData();
  }
  LoadData() {
    this.loadingData = true;
    this.http.get(`${environment.baseUrl}GetAirports`).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        this.airports = res.data;
        this.actualData = res.data;
      } else {
        this.nzNotify.error(res.message);
      }
      this.loadingData = false;
    });
  }
  SubmitFile() {
    this.loading = true;
    const formData = new FormData();
    formData.append('airportFile', this.AirportForm.get('file')?.value);
    this.http
      .post(`${environment.baseUrl}UploadAirports`, formData)
      .subscribe((res: any) => {
        if (res.data) {
          this.nzNotify.success(res.message);
          this.LoadData();
        } else {
          this.nzNotify.error(res.message);
        }
        this.loading = false;
      });
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.AirportForm.patchValue({
        file: file,
      });
    }
  }
  FilterData() {
    if (this.AirportForm.get('code')?.value == '') {
      this.airports = this.actualData;
    } else {
      this.airports = this.actualData.filter(
        (x) =>
          x.iataCode.toLowerCase() ==
          this.AirportForm.get('code')?.value.toLowerCase()
      );
    }
  }
}
