import { v2 as cloudinary } from 'cloudinary';

// CLOUDINARY_URL(cloudinary://key:secret@cloud_name) 환경변수로 자동 설정됨
export function cloudinaryConfigured(): boolean {
  return Boolean(process.env.CLOUDINARY_URL);
}

// 버퍼 업로드 → secure_url 반환. 칼럼 이미지는 webslab/column 폴더로 모은다.
export function uploadImageBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'webslab/column',
        resource_type: 'image',
        // 원본 보존 + 배포는 f_auto/q_auto URL 변환으로 최적화
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('업로드 결과가 없습니다.'));
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
