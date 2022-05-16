import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styles: [],
})
export class AirlinesComponent implements OnInit {
  AirlineForm!: FormGroup;
  loading: boolean = false;
  loadingData: boolean = false;
  airlines: any[] = [];
  actualData: any[] = [];
  pageSize: number = 7;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private nzNotify: NzMessageService
  ) {}

  ngOnInit(): void {
    this.AirlineForm = this.fb.group({
      code: [null],
      file: [null, [Validators.required]],
    });
    this.LoadData();
  }
  LoadData() {
    this.loadingData = true;
    this.http.get(`${environment.baseUrl}GetAirlines`).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        this.airlines = res.data;
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
    formData.append('airlineFile', this.AirlineForm.get('file')?.value);
    this.http
      .post(`${environment.baseUrl}UploadAirline`, formData)
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
      this.AirlineForm.patchValue({
        file: file,
      });
    }
  }
  FilterData() {
    if (this.AirlineForm.get('code')?.value == '') {
      this.airlines = this.actualData;
    } else {
      this.airlines = this.actualData.filter(
        (x) =>
          x.letterCode.toLowerCase() ==
          this.AirlineForm.get('code')?.value.toLowerCase()
      );
    }
  }
}
