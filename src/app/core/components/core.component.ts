import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "../services/common/dialog.service";
import { ToastService } from "../services/common/toast.service";
import { UserContextService } from "../services/common/userContext.service";

export class CoreComponent {
    protected readonly router = inject(Router)
    protected readonly route = inject(ActivatedRoute)
    protected readonly dialogService = inject(DialogService);
    protected readonly toastService = inject(ToastService)
    protected readonly usercontext = inject(UserContextService);

    protected isLoading = signal<boolean>(false)

}