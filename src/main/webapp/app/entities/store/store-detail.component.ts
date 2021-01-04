import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IStoreEquipment } from 'app/shared/model/store-equipment.model';

import { IStore } from 'app/shared/model/store.model';
import { StoreEquipmentService } from '../store-equipment/store-equipment.service';
import { StoreDeleteDialogComponent } from './store-delete-dialog.component';
import { StoreService } from './store.service';

@Component({
  selector: 'jhi-store-detail',
  templateUrl: './store-detail.component.html',
})
export class StoreDetailComponent implements OnInit {
  store: IStore | null = null;
  predicate!: string;
  ascending!: boolean;
  storesEquipment?: IStoreEquipment[];
  page!: number;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  ngbPaginationPage = 1;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected storeService: StoreService,
    protected equipmentService: StoreEquipmentService,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.equipmentService
      .query({
        page: pageToLoad - 1,
        sort: this.sort(),
        'storeId.in': this.store?.id,
      })
      .subscribe(
        (res: HttpResponse<IStoreEquipment[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  delete(store: IStoreEquipment): void {
    const modalRef = this.modalService.open(StoreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.store = store;
  }

  trackId(index: number, item: IStoreEquipment): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  protected loadEquipments(): void {
    const pageToLoad: number = this.page || 1;

    this.equipmentService
      .query({
        'storeId.in': this.store?.id,
      })
      .subscribe((res: HttpResponse<IStoreEquipment[]>) => this.onSuccess(res.body, res.headers, pageToLoad, false));
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ store }) => (this.store = store));
    this.predicate = 'id,';
    this.loadEquipments();
  }

  previousState(): void {
    window.history.back();
  }

  protected onSuccess(data: IStoreEquipment[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/store'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.storesEquipment = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
