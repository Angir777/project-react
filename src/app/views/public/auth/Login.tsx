import { FC, useState } from 'react';
import * as yup from 'yup';
import { APP_IS_REGISTER_ENABLED } from '../../../../envrionment';
import { useAppDispatch } from '../../../core/redux/hooks/reduxHooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { APP_BUILD } from './../../../../envrionment';

import { Button } from 'primereact/button';    
import { Ripple } from 'primereact/ripple';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const schema = yup.object().shape({
  email: yup.string().required('validation.required').email('validation.email'),
  password: yup.string().required({ msg: 'validation.required' }),
  remember: yup.boolean().nullable(),
});

// const registerEnabled = APP_IS_REGISTER_ENABLED;

const Login: FC = () => {
//   const dispatch = useAppDispatch();
  const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [isLogging, setIsLogging] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       email: APP_BUILD === 'dev' ? 'user@gmail.com' : '',
//       password: APP_BUILD === 'dev' ? 'root12' : '',
//     },
//   });

//   const onSubmit = async (formData: any) => {
//     console.log({"Login...":formData});
//   };

  return <>
    {/* Login {{ registerEnabled }} */}

    <div className="flex flex-column align-items-center justify-content-center">
      <div className="row light-blur-bg rounded-3 p-3 pb-4">
        <div className="col-12">
          <h3 className="mt-4 mb-4 text-center">{t('appName')}</h3>
        </div>
        <div className="col-6">A</div><div className="col-6">B</div>
      </div>
    </div>
  </>;
};

export default Login;
