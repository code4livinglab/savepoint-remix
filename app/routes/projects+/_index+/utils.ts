import { PCA } from 'ml-pca'
import { Project } from '@/types'

// ベクトルの正規化
export const normalize: any = (matrix: any, range: number = 1) => {
  const max = matrix.max()
  const min = matrix.min()
  return matrix.sub(min).div(max - min).sub(0.5).mul(range)
}

// 主成分分析
export const pca = (array2D: number[][]) => {
  const pca = new PCA(array2D)
  const matrix = pca.predict(array2D)
  const normalizedMatrix = normalize(matrix, 300)
  const newArray2D: number[][] = normalizedMatrix.to2DArray()
  return newArray2D
}

// プロジェクトデータの次元削減
export const reduceProjectDimension = (projectList: Project[]) => {
  const embeddings = projectList.map((project) => project.embedding)
  const components = pca(embeddings)
  
  const reducedProjectList: Project[] = projectList.map((project: any, i: number) => {
    project.embedding = components[i].slice(0, 3)
    return project
  })
  return reducedProjectList
}
