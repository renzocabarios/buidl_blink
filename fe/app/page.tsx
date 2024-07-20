"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DonationSchema } from "@/lib/schemas/donation.schema";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/lib/http";
import ConnectWallet from "@/components/connect-wallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { VersionedTransaction } from "@solana/web3.js";

interface IDonateArgs {
  amount: number;
  account: string;
}

export default function Home() {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  const { publicKey, wallet, signTransaction, sendTransaction } = useWallet();

  const { connection } = useConnection();
  const { mutate, mutateAsync, data } = useMutation({
    mutationFn: (value: IDonateArgs) => {
      return POST("api/v1/actions/donate", { ...value });
    },
  });

  const form = useForm<DonationSchema>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      amount: 0,
    },
  });
  const donate = async (value: IDonateArgs) => {
    const { data } = await mutateAsync(value);

    if (data?.transaction && signTransaction) {
      const swapTransactionBuf = Buffer.from(data?.transaction, "base64");

      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const signedTransaction = await signTransaction(transaction);
      console.log(signedTransaction);
      const rawTransaction = signedTransaction.serialize();
      console.log(rawTransaction);

      const tx = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 20,
      });

      console.log(tx);
    }
  };

  function onSubmit(values: DonationSchema) {
    if (publicKey) {
      donate({ ...values, account: publicKey.toString() })
        .then((e) => {
          console.log(e);
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
    // mutateAsync(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  if (!mounted) {
    return <></>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Form {...form}>
        <div className="max-w-[400px] flex flex-col gap-4 rounded-xl border border-primary-foreground p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium">Donate to renzothenoob</p>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={18} />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[300px] flex flex-col gap-2 p-4">
                    <p className="">
                      I am embarking on an exciting journey to master blockchain
                      technology, and I need your support. By donating to my
                      cause, you are investing in my education and future in
                      this revolutionary field. As a token of gratitude, you
                      will receive a unique digital token featuring a picture of
                      me. This token symbolizes your contribution and support
                      for my growth and learning in the blockchain space.
                    </p>

                    <p className="">
                      Your donation will go towards resources, courses, and
                      tools that will help me gain the skills and knowledge
                      needed to excel in blockchain development. Thank you for
                      being a part of my journey!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-xs text-gray-500">
              Support me on my journey to this thing called &quot;Solana&quot;
            </p>
          </div>
          <ConnectWallet />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <div className="relative w-full ">
                    <Input
                      className="w-full p-4"
                      placeholder="Enter a custom amount of SOL"
                      {...field}
                    />

                    <div className="flex items-center gap-1 top-[30%] right-[3%] absolute">
                      <Image
                        src={"/solanaLogoMark.png"}
                        alt=""
                        width={16}
                        height={16}
                      ></Image>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full text-white"
          >
            Donate Now
          </Button>
        </div>
      </Form>
    </main>
  );
}
