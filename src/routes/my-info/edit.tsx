import { createFileRoute } from '@tanstack/react-router'
import { EditMyInfoPage } from '../../pages/my-info/edit-my-info-page'

export const Route = createFileRoute('/my-info/edit')({ component: EditMyInfoPage })
