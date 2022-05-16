import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styles: [],
})
export class PassengersComponent implements OnInit {
  passengerForm: FormGroup;
  loading: boolean = false;
  loadingData: boolean = false;
  passengers: any[] = [];
  actualData: any[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private nzNotify: NzMessageService
  ) {}

  ngOnInit(): void {
    this.passengerForm = this.fb.group({
      passportNumber: [null],
      file: [null, [Validators.required]],
    });
    this.LoadData();
  }

  LoadData() {
    this.loadingData = true;
    this.http
      .get(`${environment.baseUrl}Passenger/GetPassengers`)
      .subscribe((res: any) => {
        console.log(res);
        if (res.data) {
          this.passengers = res.data;
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
    formData.append('file', this.passengerForm.get('file')?.value);
    this.http
      .post(`${environment.baseUrl}Passenger/UploadPassenger`, formData)
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
      this.passengerForm.patchValue({
        file: file,
      });
    }
  }
  FilterData() {
    if (this.passengerForm.get('passportNumber')?.value == '') {
      this.passengers = this.actualData;
    } else {
      this.passengers = this.actualData.filter(
        (x) =>
          x.passport.toLowerCase() ==
          this.passengerForm.get('passportNumber')?.value.toLowerCase()
      );
    }
  }
}
