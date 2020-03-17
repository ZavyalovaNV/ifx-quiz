import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "./common.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public options: any;
  public selectedOption: any;

  constructor(private fb: FormBuilder, private cs: CommonService) {}

  ngOnInit(): void {
    // Заполнить по умолчанию предыдущим отправленным значением
    this.selectedOption = { Id: localStorage.getItem('Id'), Name: localStorage.getItem('Name') };
    console.log(this.selectedOption);

    this.form = this.fb.group({
      StyleName: [null],
      StyleId: [null]
    });

    this.setValue()
  };

  public complete(event: any): void {
    const { query } = event;
    this.cs
      .getSuggestions(query || null)
      .toPromise()
      .then(opts => {
        this.options = opts;
      });
  }

  // Установить выбранные/введенные значения
  public setValue() {
    const { Name, Id } = this.selectedOption;
    console.log(Name, Id);

    this.form.patchValue({
        StyleName: (Id || Id === 0) ? null : (Name || this.selectedOption),
        StyleId: (Id || Id === 0) ? +Id : null
      })
  }

  // Отправка формы
  public onSubmit() {
    console.log("Отправлено: ", this.form.value);

    // Сохранить для дальнейшего предзаполнения
    localStorage.setItem('Name', this.selectedOption.Name || this.selectedOption);
    localStorage.removeItem('Id');
    // Учесть ИД == 0
    if (this.form.value.StyleId || this.form.value.StyleId === 0) {
      localStorage.setItem('Id', this.form.value.StyleId);
    }
  }
}
