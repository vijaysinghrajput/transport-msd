"use client"

import { Refine } from "@refinedev/core"
import { notificationProvider, Layout, ErrorComponent } from "@refinedev/antd"
import routerProvider from "@refinedev/nextjs-router"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"

import { dataProvider } from "@/lib/dataProvider"
import { authProvider } from "@/lib/authProvider"
import { resources } from "@/config/resources"

import "@refinedev/antd/dist/reset.css"

export default function RefineApp({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 6,
          },
        }}
      >
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          authProvider={authProvider}
          notificationProvider={notificationProvider}
          resources={resources}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "mudrabase-solar-crm",
          }}
        >
          <Layout>{children}</Layout>
        </Refine>
      </ConfigProvider>
    </AntdRegistry>
  )
}