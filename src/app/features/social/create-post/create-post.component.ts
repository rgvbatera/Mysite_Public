import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Output() postCreated = new EventEmitter<void>();
  
  postForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  imagePreview: string | null = null;

  categories = [
    { value: 'programacao', label: '💻 Programação', icon: '💻' },
    { value: 'jogos', label: '🎮 Jogos', icon: '🎮' },
    { value: 'bateria', label: '🥁 Bateria', icon: '🥁' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['programacao', Validators.required],
      imageUrl: ['']
    });
  }

  get f() {
    return this.postForm.controls;
  }

  onImageUrlChange(event: any): void {
    const url = event.target.value;
    if (url) {
      this.imagePreview = url;
    } else {
      this.imagePreview = null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.postForm.invalid) {
      return;
    }

    this.loading = true;

    this.postService.createPost(this.postForm.value).subscribe({
      next: () => {
        this.postCreated.emit();
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao criar post. Tente novamente.';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.postForm.reset({ category: 'programacao' });
    this.submitted = false;
    this.loading = false;
    this.imagePreview = null;
  }

  getCharCount(field: string): number {
    return this.postForm.get(field)?.value?.length || 0;
  }

  getMaxLength(field: string): number {
    const validators = this.postForm.get(field)?.validator;
    if (validators) {
      const validation = validators({} as any);
      if (validation && validation['maxlength']) {
        return validation['maxlength'].requiredLength;
      }
    }
    return field === 'title' ? 200 : 10000;
  }
}
