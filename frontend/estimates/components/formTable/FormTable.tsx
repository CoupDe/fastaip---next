import { FormKS } from '@/lib/api/getAllFormData'
import React from 'react'

type Props = { dataForm: FormKS[] }

const FormTable = (props: Props) => {
    return (
        <div>{props.dataForm[0].local_num}</div>
    )
}

export default FormTable