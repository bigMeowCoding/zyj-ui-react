import React, { FC, Fragment, useState } from "react";
import Form from "./form";
import { FormErrors, FormValue, InputType } from "./types";
import Button from "../button/button";
import Validator from "./validator";

interface Props {}

const names = ["lilei", "jame", "zhouyijun"];

const hasUser = function (username: string): Promise<boolean> {
  return new Promise((res) => {
    setTimeout(() => {
      res(!names.includes(username));
    }, 3000);
  });
};

const FormExample: FC<Props> = function () {
  const [formData, setFormData] = useState<FormValue>({
    username: "",
    password: "",
  });
  const [fields] = useState([
    {
      name: "username",
      label: "用户名",
      input: {
        type: InputType.text,
      },
    },
    {
      name: "password",
      label: "密码",
      input: {
        type: InputType.password,
      },
    },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  return (
    <div>
      <article>
        <h2>example 1</h2>
        <section>
          <Form
            value={formData}
            fields={fields}
            errors={errors}
            onSubmit={() => {
              setErrors({});
              Validator(formData, [
                {
                  key: "username",
                  required: true,
                  minLength: 5,
                  pattern: /^\d+$/,
                  validator: {
                    name: "unique",
                    message: "用户名已经存在",
                    validate: (value) => {
                      return hasUser(value);
                    },
                  },
                },
                {
                  key: "password",
                  required: true,
                  pattern: /^\D+$/,
                },
              ],(errors)=>{
                if (Object.keys(errors).length > 0) {
                  setErrors(errors);
                }
              });
            }}
            onChange={(value) => {
              setFormData(value);
            }}
            buttons={
              <Fragment>
                <Button type="primary" defaultType="submit">
                  提交
                </Button>
                <Button> 返回</Button>
              </Fragment>
            }
          />
        </section>
      </article>
    </div>
  );
};
export default FormExample;
